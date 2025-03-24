#!/usr/bin/env python3

import argparse
import logging
import os
import signal
import subprocess
import sys
import threading
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

import docker
import psutil
import requests
import yaml
from rich.console import Console
from rich.live import Live
from rich.logging import RichHandler
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table

# Configure rich console and logging
console = Console()
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    datefmt="[%X]",
    handlers=[RichHandler(console=console, rich_tracebacks=True)]
)
log = logging.getLogger("trigo")

@dataclass
class ServiceConfig:
    name: str
    compose_file: str
    health_check_url: str
    required_ports: List[int]
    dependencies: List[str]
    startup_order: int
    min_memory_gb: float
    min_disk_gb: float
    environment: Dict[str, str]
    healthcheck_timeout: int
    auto_restart: bool
    max_restart_attempts: int

class ServiceStatus:
    def __init__(self):
        self.running = False
        self.health = "Not Started"
        self.start_time: Optional[datetime] = None
        self.restart_count = 0
        self.last_error: Optional[str] = None
        self.cpu_usage: Optional[float] = None
        self.memory_usage: Optional[float] = None

class TrigoStartupManager:
    def __init__(self):
        self.docker_client = docker.from_env()
        self.workspace_root = Path(__file__).parent.parent
        self.config_path = self.workspace_root / "config/services.yml"
        self.services: Dict[str, ServiceConfig] = self._load_service_config()
        self.service_status: Dict[str, ServiceStatus] = {
            name: ServiceStatus() for name in self.services.keys()
        }
        self.monitoring = False
        self.monitor_thread: Optional[threading.Thread] = None
        
        # Set up signal handlers
        signal.signal(signal.SIGINT, self.handle_shutdown)
        signal.signal(signal.SIGTERM, self.handle_shutdown)
        
        # Create logs directory
        self.logs_dir = self.workspace_root / "logs"
        self.logs_dir.mkdir(exist_ok=True)
        
        # Set up file logging
        self.setup_file_logging()

    def setup_file_logging(self):
        """Set up logging to file with rotation."""
        from logging.handlers import RotatingFileHandler
        file_handler = RotatingFileHandler(
            self.logs_dir / "trigo_startup.log",
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        ))
        log.addHandler(file_handler)

    def _load_service_config(self) -> Dict[str, ServiceConfig]:
        """Load service configuration from YAML file."""
        if not self.config_path.exists():
            self._create_default_config()
        
        with open(self.config_path) as f:
            config = yaml.safe_load(f)
        
        services = {}
        for name, cfg in config['services'].items():
            services[name] = ServiceConfig(
                name=cfg['name'],
                compose_file=cfg['compose_file'],
                health_check_url=cfg['health_check_url'],
                required_ports=cfg['required_ports'],
                dependencies=cfg.get('dependencies', []),
                startup_order=cfg.get('startup_order', 0),
                min_memory_gb=cfg.get('min_memory_gb', 1),
                min_disk_gb=cfg.get('min_disk_gb', 5),
                environment=cfg.get('environment', {}),
                healthcheck_timeout=cfg.get('healthcheck_timeout', 30),
                auto_restart=cfg.get('auto_restart', True),
                max_restart_attempts=cfg.get('max_restart_attempts', 3)
            )
        return services

    def _create_default_config(self):
        """Create default service configuration file."""
        default_config = {
            'services': {
                'supabase': {
                    'name': 'supabase',
                    'compose_file': 'docker-compose.supabase.yml',
                    'health_check_url': 'http://localhost:8000/health',
                    'required_ports': [5432, 8000, 3010],
                    'dependencies': [],
                    'startup_order': 1,
                    'min_memory_gb': 2,
                    'min_disk_gb': 5,
                    'environment': {},
                    'healthcheck_timeout': 30,
                    'auto_restart': True,
                    'max_restart_attempts': 3
                },
                'passenger': {
                    'name': 'passenger-app',
                    'compose_file': 'docker-compose.yml',
                    'health_check_url': 'http://localhost:3000/health',
                    'required_ports': [3000],
                    'dependencies': ['supabase'],
                    'startup_order': 2,
                    'min_memory_gb': 1,
                    'min_disk_gb': 2,
                    'environment': {},
                    'healthcheck_timeout': 30,
                    'auto_restart': True,
                    'max_restart_attempts': 3
                },
                'driver': {
                    'name': 'driver-app',
                    'compose_file': 'docker-compose.yml',
                    'health_check_url': 'http://localhost:3001/health',
                    'required_ports': [3001],
                    'dependencies': ['supabase'],
                    'startup_order': 2,
                    'min_memory_gb': 1,
                    'min_disk_gb': 2,
                    'environment': {},
                    'healthcheck_timeout': 30,
                    'auto_restart': True,
                    'max_restart_attempts': 3
                },
                'dispatcher': {
                    'name': 'dispatcher-app',
                    'compose_file': 'docker-compose.yml',
                    'health_check_url': 'http://localhost:3002/health',
                    'required_ports': [3002],
                    'dependencies': ['supabase'],
                    'startup_order': 2,
                    'min_memory_gb': 1,
                    'min_disk_gb': 2,
                    'environment': {},
                    'healthcheck_timeout': 30,
                    'auto_restart': True,
                    'max_restart_attempts': 3
                }
            }
        }
        
        self.config_path.parent.mkdir(exist_ok=True)
        with open(self.config_path, 'w') as f:
            yaml.dump(default_config, f, default_flow_style=False)

    def check_system_requirements(self) -> bool:
        """Verify system meets minimum requirements."""
        try:
            # Check Docker is running
            self.docker_client.ping()
            
            # Calculate total required resources
            total_memory_required = sum(s.min_memory_gb for s in self.services.values())
            total_disk_required = sum(s.min_disk_gb for s in self.services.values())
            
            # Check available memory
            available_memory = psutil.virtual_memory().available / (1024 * 1024 * 1024)
            if available_memory < total_memory_required:
                log.error(f"Insufficient memory. Available: {available_memory:.1f}GB, Required: {total_memory_required}GB")
                return False
            
            # Check available disk space
            disk_usage = psutil.disk_usage(self.workspace_root)
            available_space = disk_usage.free / (1024 * 1024 * 1024)
            if available_space < total_disk_required:
                log.error(f"Insufficient disk space. Available: {available_space:.1f}GB, Required: {total_disk_required}GB")
                return False
            
            # Check Docker version
            version = self.docker_client.version()
            min_version = "20.10.0"
            if version['Version'] < min_version:
                log.error(f"Docker version {version['Version']} is too old. Minimum required: {min_version}")
                return False
            
            # Check required ports
            used_ports = set()
            for service in self.services.values():
                for port in service.required_ports:
                    if self.is_port_in_use(port):
                        log.error(f"Port {port} is already in use")
                        return False
                    used_ports.add(port)
            
            # Check network connectivity
            try:
                requests.get("https://registry.hub.docker.com", timeout=5)
            except requests.exceptions.RequestException:
                log.error("No internet connection available")
                return False
            
            return True
            
        except docker.errors.APIError as e:
            log.error(f"Docker daemon not running: {e}")
            return False
        except Exception as e:
            log.error(f"System check failed: {e}")
            return False

    def is_port_in_use(self, port: int) -> bool:
        """Check if a port is in use."""
        import socket
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(('localhost', port)) == 0

    def monitor_services(self):
        """Monitor service health and resource usage."""
        self.monitoring = True
        while self.monitoring:
            try:
                for name, service in self.services.items():
                    status = self.service_status[name]
                    if status.running:
                        # Check container health
                        containers = self.docker_client.containers.list(
                            filters={"name": f"*{service.name}*"}
                        )
                        if containers:
                            container = containers[0]
                            stats = container.stats(stream=False)
                            
                            # Update CPU and memory usage
                            cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - \
                                      stats['precpu_stats']['cpu_usage']['total_usage']
                            system_delta = stats['cpu_stats']['system_cpu_usage'] - \
                                         stats['precpu_stats']['system_cpu_usage']
                            status.cpu_usage = (cpu_delta / system_delta) * 100
                            
                            status.memory_usage = stats['memory_stats']['usage'] / (1024 * 1024)  # MB
                            
                            # Check health endpoint
                            try:
                                response = requests.get(service.health_check_url, timeout=5)
                                status.health = "Healthy" if response.ok else "Unhealthy"
                            except:
                                status.health = "Unreachable"
                                
                            # Auto-restart if needed
                            if (status.health != "Healthy" and 
                                service.auto_restart and 
                                status.restart_count < service.max_restart_attempts):
                                log.warning(f"Service {service.name} unhealthy, attempting restart...")
                                self.restart_service(name)
                
            except Exception as e:
                log.error(f"Error in monitoring thread: {e}")
            
            time.sleep(5)  # Check every 5 seconds

    def start_service(self, service_name: str) -> bool:
        """Start a specific service and its dependencies."""
        service = self.services[service_name]
        status = self.service_status[service_name]
        
        # Check and start dependencies first
        if service.dependencies:
            for dep in service.dependencies:
                if not self.service_status[dep].running:
                    if not self.start_service(dep):
                        return False

        try:
            compose_file = self.workspace_root / service.compose_file
            
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console
            ) as progress:
                task = progress.add_task(f"Starting {service.name}...", total=None)
                
                # Set environment variables
                env = os.environ.copy()
                env.update(service.environment)
                
                # Pull images first
                subprocess.run(
                    f"docker-compose -f {compose_file} pull",
                    shell=True, check=True, capture_output=True,
                    env=env
                )
                
                # Start the service
                subprocess.run(
                    f"docker-compose -f {compose_file} up -d {service.name}",
                    shell=True, check=True, capture_output=True,
                    env=env
                )
                
                # Wait for health check
                start_time = time.time()
                while time.time() - start_time < service.healthcheck_timeout:
                    try:
                        containers = self.docker_client.containers.list(
                            filters={"name": f"*{service.name}*"}
                        )
                        if containers and containers[0].status == "running":
                            # Verify health endpoint
                            response = requests.get(service.health_check_url, timeout=5)
                            if response.ok:
                                status.running = True
                                status.health = "Healthy"
                                status.start_time = datetime.now()
                                progress.update(task, description=f"{service.name} started successfully")
                                return True
                    except Exception as e:
                        status.last_error = str(e)
                    time.sleep(1)
                
                progress.update(task, description=f"Failed to start {service.name}")
                return False
                
        except subprocess.CalledProcessError as e:
            log.error(f"Failed to start {service.name}: {e.stderr.decode()}")
            status.last_error = e.stderr.decode()
            return False
        except Exception as e:
            log.error(f"Unexpected error starting {service.name}: {e}")
            status.last_error = str(e)
            return False

    def restart_service(self, service_name: str) -> bool:
        """Restart a specific service."""
        service = self.services[service_name]
        status = self.service_status[service_name]
        
        try:
            compose_file = self.workspace_root / service.compose_file
            subprocess.run(
                f"docker-compose -f {compose_file} restart {service.name}",
                shell=True, check=True, capture_output=True
            )
            status.restart_count += 1
            return True
        except Exception as e:
            log.error(f"Failed to restart {service.name}: {e}")
            return False

    def show_status(self):
        """Display current status of all services."""
        table = Table(title="TriGo Services Status")
        table.add_column("Service", style="cyan")
        table.add_column("Status", style="green")
        table.add_column("Health", style="magenta")
        table.add_column("Uptime", style="yellow")
        table.add_column("CPU %", style="blue")
        table.add_column("Memory MB", style="blue")
        table.add_column("Restarts", style="red")
        
        for name, service in self.services.items():
            status = self.service_status[name]
            uptime = ""
            if status.start_time:
                uptime = str(datetime.now() - status.start_time).split('.')[0]
            
            table.add_row(
                service.name,
                "✅ Running" if status.running else "❌ Stopped",
                status.health,
                uptime,
                f"{status.cpu_usage:.1f}" if status.cpu_usage else "N/A",
                f"{status.memory_usage:.1f}" if status.memory_usage else "N/A",
                str(status.restart_count)
            )
        
        return table

    def handle_shutdown(self, signum, frame):
        """Handle graceful shutdown on SIGINT/SIGTERM."""
        log.info("\nInitiating graceful shutdown...")
        self.monitoring = False
        if self.monitor_thread:
            self.monitor_thread.join()
        
        try:
            # Stop services in reverse order
            for service_name in sorted(
                self.services.keys(),
                key=lambda x: self.services[x].startup_order,
                reverse=True
            ):
                status = self.service_status[service_name]
                if status.running:
                    service = self.services[service_name]
                    compose_file = self.workspace_root / service.compose_file
                    subprocess.run(
                        f"docker-compose -f {compose_file} down",
                        shell=True, check=True, capture_output=True
                    )
                    log.info(f"Stopped {service.name}")
        except Exception as e:
            log.error(f"Error during shutdown: {e}")
        finally:
            sys.exit(0)

def main():
    parser = argparse.ArgumentParser(description="TriGo Application Startup Manager")
    parser.add_argument("--debug", action="store_true", help="Enable debug logging")
    parser.add_argument("--no-monitor", action="store_true", help="Disable service monitoring")
    args = parser.parse_args()

    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)

    manager = TrigoStartupManager()
    
    console.print("[bold cyan]TriGo Startup Manager[/bold cyan]")
    console.print("Checking system requirements...")
    
    if not manager.check_system_requirements():
        console.print("[bold red]System requirements not met. Please fix the issues and try again.[/bold red]")
        sys.exit(1)
    
    console.print("[green]System requirements met. Starting services...[/green]")
    
    # Start monitoring thread
    if not args.no_monitor:
        manager.monitor_thread = threading.Thread(target=manager.monitor_services)
        manager.monitor_thread.daemon = True
        manager.monitor_thread.start()
    
    # Start services in order of dependencies
    for service_name in sorted(manager.services.keys(), 
                             key=lambda x: manager.services[x].startup_order):
        if not manager.start_service(service_name):
            console.print(f"[bold red]Failed to start {service_name}. Stopping all services...[/bold red]")
            manager.handle_shutdown(None, None)
            sys.exit(1)
    
    # Show live status updates
    with Live(manager.show_status(), refresh_per_second=1) as live:
        try:
            while True:
                live.update(manager.show_status())
                time.sleep(1)
        except KeyboardInterrupt:
            pass

if __name__ == "__main__":
    main() 