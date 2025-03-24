#!/usr/bin/env python3
import argparse
import json
import os
import platform
import subprocess
import sys
import time
import webbrowser
from typing import Any, Dict, List, Optional, Tuple

# Default ports for applications
DEFAULT_PORTS = {
    "passenger": 3000,
    "driver": 3001,
    "dispatcher": 3002
}

class TrigoError(Exception):
    """Custom exception for TriGo app errors."""
    pass

# Philippines Flag Theme Colors
PH_RED = "\033[1;38;5;196m"     # Bright red 
PH_BLUE = "\033[1;38;5;21m"     # Royal blue
PH_YELLOW = "\033[1;38;5;220m"  # Sun yellow
PH_WHITE = "\033[1;38;5;255m"   # Bright white
PH_BG_RED = "\033[48;5;196m"    # Red background
PH_BG_BLUE = "\033[48;5;21m"    # Blue background
PH_BG_YELLOW = "\033[48;5;220m" # Yellow background
RESET = "\033[0m"               # Reset all formatting

def print_colored(message: str, color: str) -> None:
    """Print colored text to the console using Philippines flag colors."""
    colors = {
        "red": PH_RED,
        "blue": PH_BLUE,
        "yellow": PH_YELLOW,
        "white": PH_WHITE,
        "bg_red": PH_BG_RED,
        "bg_blue": PH_BG_BLUE,
        "bg_yellow": PH_BG_YELLOW,
        "reset": RESET
    }
    
    print(f"{colors.get(color.lower(), '')}{message}{RESET}")

def print_ph_header(title: str) -> None:
    """Print a Philippines flag-themed header with honeycomb styling."""
    width = len(title) + 8
    honeycomb_length = width + 4
    
    # Create honeycomb pattern
    honeycomb_top = "".join([f"{PH_BLUE}⬡{RESET}" if i % 2 == 0 else f"{PH_RED}⬡{RESET}" for i in range(honeycomb_length)])
    honeycomb_bottom = "".join([f"{PH_RED}⬡{RESET}" if i % 2 == 0 else f"{PH_BLUE}⬡{RESET}" for i in range(honeycomb_length)])
    
    print(honeycomb_top)
    print(f"{PH_BLUE}★{PH_YELLOW} {title.center(width)} {PH_BLUE}★{RESET}")
    print(honeycomb_bottom)

def print_status_item(name: str, status: str, ports: str = None) -> None:
    """Print a status item with Philippines flag honeycomb styling."""
    status_lower = status.lower()
    
    if status_lower in ["running", "up"]:
        status_color = PH_BLUE
        status_icon = "◉"
    else:
        status_color = PH_RED
        status_icon = "◎"
    
    print(f"{PH_YELLOW}⬢ {PH_WHITE}{name}: {status_color}{status_icon} {status}{RESET}")
    if ports:
        print(f"  {PH_BLUE}↪ {PH_WHITE}Ports: {ports}{RESET}")

def is_rhel() -> bool:
    """Check if running on RHEL."""
    if os.path.isfile('/etc/redhat-release'):
        with open('/etc/redhat-release', 'r') as f:
            return 'Red Hat Enterprise Linux' in f.read()
    return False

def get_os_info() -> str:
    """Get OS information."""
    if is_rhel():
        with open('/etc/redhat-release', 'r') as f:
            return f.read().strip()
    elif sys.platform == 'darwin':
        return f"macOS {platform.mac_ver()[0]}"
    elif sys.platform.startswith('win'):
        return f"Windows {platform.win32_ver()[0]}"
    elif sys.platform.startswith('linux'):
        try:
            import distro
            return f"{distro.name()} {distro.version()}"
        except ImportError:
            return f"Linux {platform.release()}"
    return sys.platform

def check_docker() -> bool:
    """Check if Docker is running."""
    try:
        result = subprocess.run(
            ["docker", "info"], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE, 
            text=True,
            check=False  # Don't raise exception so we can handle it
        )
        
        if result.returncode != 0:
            if "permission denied" in result.stderr.lower():
                print_colored("Error: Permission denied when accessing Docker. Try running with sudo or adding your user to the docker group.", "red")
                print_colored("Run: sudo usermod -aG docker $USER && newgrp docker", "yellow")
                return False
            elif "cannot connect to the docker daemon" in result.stderr.lower():
                print_colored("Error: Docker daemon is not running.", "red")
                if is_rhel():
                    print_colored("Run: sudo systemctl start docker", "yellow")
                else:
                    print_colored("Please start Docker and try again.", "yellow")
                return False
            elif "docker-credential" in result.stderr:
                # We'll handle credential issues separately
                print_colored("Warning: Docker credential issue detected, but we'll try to continue.", "yellow")
                return True
            else:
                print_colored(f"Error with Docker: {result.stderr}", "red")
                return False
        return True
    except FileNotFoundError:
        print_colored("Error: Docker is not installed.", "red")
        if is_rhel():
            print_colored("Install Docker on RHEL 9 with:", "yellow")
            print_colored("sudo dnf install -y dnf-plugins-core", "yellow")
            print_colored("sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo", "yellow")
            print_colored("sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin", "yellow")
            print_colored("sudo systemctl start docker", "yellow")
            print_colored("sudo systemctl enable docker", "yellow")
        return False
    except Exception as e:
        print_colored(f"Unexpected error checking Docker: {str(e)}", "red")
        return False

def fix_docker_credentials() -> None:
    """Fix Docker credential issues."""
    if is_rhel():
        # On RHEL, we'll set up a basic credential store configuration
        docker_config_dir = os.path.expanduser("~/.docker")
        docker_config_file = os.path.join(docker_config_dir, "config.json")
        
        # Create docker config directory if it doesn't exist
        os.makedirs(docker_config_dir, exist_ok=True)
        
        # Check if config file exists
        if os.path.exists(docker_config_file):
            try:
                with open(docker_config_file, 'r') as f:
                    config = json.load(f)
            except (json.JSONDecodeError, IOError):
                config = {}
        else:
            config = {}
        
        # Set credential store to empty string or remove it
        if 'credsStore' in config:
            del config['credsStore']
        
        # Add basic auths if not present
        if 'auths' not in config:
            config['auths'] = {"https://index.docker.io/v1/": {}}
        
        # Write updated config
        try:
            with open(docker_config_file, 'w') as f:
                json.dump(config, f, indent=2)
            print_colored("Updated Docker credential configuration.", "blue")
        except IOError as e:
            print_colored(f"Warning: Could not update Docker config: {str(e)}", "yellow")

def run_command(cmd: List[str], capture_output: bool = False, 
                show_output: bool = True, check: bool = True) -> subprocess.CompletedProcess:
    """Run a command and handle exceptions appropriately."""
    try:
        if capture_output:
            result = subprocess.run(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                check=check
            )
        else:
            result = subprocess.run(cmd, check=check)
        return result
    except subprocess.SubprocessError as e:
        error_output = e.stderr if hasattr(e, 'stderr') else str(e)
        
        if "docker-credential" in error_output:
            print_colored("Docker credential error detected. Attempting to fix...", "yellow")
            fix_docker_credentials()
            # Try running the command again
            if capture_output:
                return subprocess.run(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    check=False
                )
            else:
                return subprocess.run(cmd, check=False)
        else:
            if show_output:
                print_colored(f"Error running command {' '.join(cmd)}: {error_output}", "red")
            if check:
                raise
            return e
    except FileNotFoundError as e:
        if show_output:
            print_colored(f"Command not found: {cmd[0]}", "red")
        if check:
            raise
        # Return a fake CompletedProcess with error
        return subprocess.CompletedProcess(cmd, 127, '', f"Command not found: {cmd[0]}")

def get_script_path(script_name: str) -> str:
    """Get the absolute path to a script relative to this script's location."""
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    script_path = os.path.join(script_dir, script_name)

    # If script doesn't exist in the script directory, check current working directory
    if not os.path.isfile(script_path):
        cwd_path = os.path.join(os.getcwd(), script_name)
        if os.path.isfile(cwd_path):
            return cwd_path

        # Also check for scripts in a 'scripts' subdirectory
        scripts_dir_path = os.path.join(script_dir, "scripts", script_name)
        if os.path.isfile(scripts_dir_path):
            return scripts_dir_path

    return script_path

def run_script(script_name: str, show_logs: bool = True) -> None:
    """Run a bash script with the specified name."""
    script_path = get_script_path(script_name)
    
    if not os.path.isfile(script_path):
        print_colored(f"Error: Script '{script_name}' not found at {script_path}.", "red")
        sys.exit(1)
    
    # Make sure the script is executable
    os.chmod(script_path, 0o755)
    
    print_colored(f"Running {script_path}...", "blue")
    
    # First check Docker
    if not check_docker():
        print_colored("Docker issues must be fixed before proceeding.", "red")
        sys.exit(1)
    
    # Attempt to fix credentials preemptively
    fix_docker_credentials()
    
    try:
        # Use bash explicitly to run the script
        shell_cmd = ["bash", script_path]
        result = run_command(shell_cmd, capture_output=True, show_output=False, check=False)
        
        # Print output for visibility
        if result.stdout:
            print(result.stdout)
        
        # Check for specific errors
        if result.returncode != 0:
            if "docker-credential" in result.stderr:
                print_colored("Docker credential issue detected in script.", "yellow")
                print_colored("This is likely due to Docker Desktop credential helper being referenced.", "yellow")
                print_colored("Fixing Docker config and retrying...", "yellow")
                
                # Fix the Docker config and try again
                fix_docker_credentials()
                
                # Modify the script temporarily to bypass credential issues
                temp_script = f"{script_path}.temp"
                try:
                    with open(script_path, 'r') as original, open(temp_script, 'w') as temp:
                        content = original.read()
                        # Add fix at the beginning of the script
                        fixed_content = (
                            "#!/bin/bash\n\n"
                            "# Temporary fix for Docker credential issues\n"
                            "mkdir -p ~/.docker\n"
                            "echo '{\"auths\":{}}' > ~/.docker/config.json\n\n"
                        ) + content
                        temp.write(fixed_content)
                    
                    # Make temp script executable
                    os.chmod(temp_script, 0o755)
                    
                    # Run the modified script
                    print_colored("Retrying with modified script...", "blue")
                    subprocess.run(["bash", temp_script], check=True)
                    
                finally:
                    # Clean up temporary script
                    if os.path.exists(temp_script):
                        os.remove(temp_script)
            
            elif "failed to solve" in result.stderr:
                print_colored("Docker image build failed.", "red")
                print_colored("This might be due to network issues or Docker registry problems.", "yellow")
                print_colored("Detailed error:", "yellow")
                print(result.stderr)
                sys.exit(1)
            
            elif "No such file or directory" in result.stderr and "docker-compose" in result.stderr:
                print_colored("Error: docker-compose command not found.", "red")
                if is_rhel():
                    print_colored("On RHEL 9, Docker Compose is usually accessed with 'docker compose' (no hyphen).", "yellow")
                    print_colored("Attempting to fix script and retry...", "yellow")
                    
                    # Modify the script temporarily to use 'docker compose' instead of 'docker-compose'
                    temp_script = f"{script_path}.temp"
                    try:
                        with open(script_path, 'r') as original, open(temp_script, 'w') as temp:
                            content = original.read()
                            # Replace docker-compose with docker compose
                            fixed_content = content.replace('docker-compose', 'docker compose')
                            temp.write(fixed_content)
                        
                        # Make temp script executable
                        os.chmod(temp_script, 0o755)
                        
                        # Run the modified script
                        print_colored("Retrying with modified script...", "blue")
                        subprocess.run(["bash", temp_script], check=True)
                        
                    finally:
                        # Clean up temporary script
                        if os.path.exists(temp_script):
                            os.remove(temp_script)
                else:
                    print_colored("Please install Docker Compose and try again.", "yellow")
                    sys.exit(1)
            
            else:
                print_colored("Script execution failed:", "red")
                if result.stderr:
                    print(result.stderr)
                sys.exit(1)
    
    except subprocess.SubprocessError as e:
        print_colored(f"Error running script: {e}", "red")
        sys.exit(1)
    except Exception as e:
        print_colored(f"Unexpected error: {str(e)}", "red")
        sys.exit(1)

def open_app_browsers(ports: dict) -> None:
    """Open browsers for each application."""
    for app, port in ports.items():
        url = f"http://localhost:{port}"
        print_colored(f"Opening {app.capitalize()} app in browser: {url}", "blue")
        try:
            webbrowser.open(url)
        except Exception as e:
            print_colored(f"Warning: Could not open browser for {app}: {str(e)}", "yellow")
            print_colored(f"Please open manually: {url}", "white")

def get_container_status() -> List[dict]:
    """Get the status of all containers."""
    try:
        # First try with modern 'docker compose' (no hyphen)
        result = run_command(
            ["docker", "compose", "ps", "--format", "json"],
            capture_output=True,
            check=False
        )
        
        if result.returncode != 0:
            # Try with legacy 'docker-compose' (with hyphen)
            result = run_command(
                ["docker-compose", "ps", "--format", "json"],
                capture_output=True,
                check=False
            )
        
        if result.returncode != 0:
            # If both fail, try plain 'docker compose ps' and parse the output
            result = run_command(
                ["docker", "compose", "ps"],
                capture_output=True,
                check=False
            )
            
            if result.returncode != 0:
                # Try one more with legacy command
                result = run_command(
                    ["docker-compose", "ps"],
                    capture_output=True,
                    check=False
                )
            
            # Parse text output
            containers = []
            if result.returncode == 0:
                lines = result.stdout.strip().split('\n')
                if len(lines) > 1:  # Skip header
                    for line in lines[1:]:
                        if not line.strip():
                            continue
                        parts = line.split()
                        if len(parts) >= 3:
                            containers.append({
                                "Name": parts[0],
                                "State": parts[1],
                                "Ports": " ".join([p for p in parts if ":" in p])
                            })
            return containers
        
        try:
            # Modern Docker Compose may output one JSON object per line
            containers = []
            for line in result.stdout.strip().split('\n'):
                if line.strip():
                    try:
                        containers.append(json.loads(line))
                    except json.JSONDecodeError:
                        pass
            
            if containers:
                return containers
                
            # Try parsing as a single JSON array
            return json.loads(result.stdout)
            
        except json.JSONDecodeError:
            # Fallback to plain text output parsing
            containers = []
            lines = result.stdout.strip().split('\n')
            if len(lines) > 1:  # Skip header
                for line in lines[1:]:
                    if not line.strip():
                        continue
                    parts = line.split()
                    if len(parts) >= 3:
                        containers.append({
                            "Name": parts[0],
                            "State": parts[1],
                            "Ports": " ".join([p for p in parts if ":" in p])
                        })
            return containers
    except Exception as e:
        print_colored(f"Warning: Error getting container status: {str(e)}", "yellow")
        return []

def view_logs(follow: bool = True) -> None:
    """View logs from all containers."""
    # Try both docker compose and docker-compose commands
    commands = [
        ["docker", "compose", "logs"],
        ["docker-compose", "logs"]
    ]
    
    if follow:
        commands[0].append("-f")
        commands[1].append("-f")
    
    success = False
    for cmd in commands:
        try:
            print_colored("Showing container logs (Ctrl+C to exit):", "yellow")
            result = run_command(cmd, check=False)
            if result.returncode == 0:
                success = True
                break
        except Exception:
            continue
    
    if not success:
        print_colored("Error: Unable to view logs. Both 'docker compose' and 'docker-compose' commands failed.", "red")

def stop_containers() -> None:
    """Stop all running containers."""
    # Try both docker compose and docker-compose commands
    commands = [
        ["docker", "compose", "down"],
        ["docker-compose", "down"]
    ]
    
    success = False
    for cmd in commands:
        try:
            print_colored("Stopping containers...", "yellow")
            result = run_command(cmd, check=False)
            if result.returncode == 0:
                print_colored("Containers stopped successfully.", "blue")
                success = True
                break
        except Exception:
            continue
    
    if not success:
        print_colored("Error: Unable to stop containers. Both 'docker compose' and 'docker-compose' commands failed.", "red")

def restart_containers() -> None:
    """Restart all containers."""
    stop_containers()
    print_colored("Starting containers...", "yellow")
    start_with_advanced_script(show_logs=False, open_browsers=False)
    print_colored("Containers restarted successfully.", "blue")

def start_with_simple_script(show_logs: bool = True, open_browsers: bool = True) -> None:
    """Start containers using the simple script."""
    if not check_docker():
        print_colored("Docker issues must be fixed before proceeding.", "red")
        sys.exit(1)
    
    run_script("start-containers.sh")
    
    # Verify containers are running
    print_colored("Verifying containers are running...", "blue")
    time.sleep(5)  # Give containers a moment to start
    
    containers = get_container_status()
    all_running = True
    
    for container in containers:
        state = container.get("State", "").lower()
        name = container.get("Name", "Unknown")
        
        if state not in ["running", "up"]:
            print_colored(f"Container {name} is not running: {state}", "red")
            all_running = False
    
    if not all_running:
        print_colored("Warning: Not all containers are running. Check logs for details.", "yellow")
    else:
        print_colored("All containers are running successfully!", "blue")
    
    # Open browsers manually if requested (since the simple script doesn't do this)
    if open_browsers:
        open_app_browsers(DEFAULT_PORTS)
    
    if show_logs:
        view_logs()

def start_with_advanced_script(show_logs: bool = True, open_browsers: bool = True) -> None:
    """Start containers using the advanced script with port management."""
    if not check_docker():
        print_colored("Docker issues must be fixed before proceeding.", "red")
        sys.exit(1)
    
    run_script("start-apps.sh")
    
    # Verify containers are running
    print_colored("Verifying containers are running...", "blue")
    time.sleep(5)  # Give containers a moment to start
    
    containers = get_container_status()
    all_running = True
    
    for container in containers:
        state = container.get("State", "").lower()
        name = container.get("Name", "Unknown")
        
        if state not in ["running", "up"]:
            print_colored(f"Container {name} is not running: {state}", "red")
            all_running = False
    
    if not all_running:
        print_colored("Warning: Not all containers are running. Check logs for details.", "yellow")
    else:
        print_colored("All containers are running successfully!", "blue")
    
    # The advanced script already handles browser opening and logs
    # But may need to explicitly open browsers again
    if open_browsers and is_rhel():
        # On RHEL, browser opening might not have worked in the script
        open_app_browsers(DEFAULT_PORTS)

def main() -> None:
    parser = argparse.ArgumentParser(description="TriGo App Manager - Manage TriGo application containers")
    
    # Main command group
    command_group = parser.add_argument_group("Commands")
    command = command_group.add_mutually_exclusive_group(required=True)
    command.add_argument("--start", action="store_true", help="Start all containers")
    command.add_argument("--stop", action="store_true", help="Stop all containers")
    command.add_argument("--restart", action="store_true", help="Restart all containers")
    command.add_argument("--status", action="store_true", help="Show status of all containers")
    command.add_argument("--logs", action="store_true", help="View container logs")
    command.add_argument("--fix-docker", action="store_true", help="Fix Docker credential issues")
    command.add_argument("--system-info", action="store_true", help="Show system information")
    
    # Options
    options_group = parser.add_argument_group("Options")
    options_group.add_argument("--simple", action="store_true", 
                              help="Use the simple start script (start-containers.sh)")
    options_group.add_argument("--advanced", action="store_true", 
                              help="Use the advanced start script with port management (start-apps.sh)")
    options_group.add_argument("--no-logs", action="store_true", 
                              help="Don't show logs after starting")
    options_group.add_argument("--no-browser", action="store_true", 
                              help="Don't open browsers")
    
    args = parser.parse_args()
    
    # Philippine flag-style app title
    print("\n")
    print(f"{PH_RED}★{PH_BLUE}★{PH_YELLOW}★ {PH_WHITE}TriGo App Manager {PH_RED}★{PH_BLUE}★{PH_YELLOW}★{RESET}")
    print("\n")
    
    try:
        if args.system_info:
            print_ph_header("System Information")
            print(f"{PH_YELLOW}⬢ {PH_WHITE}OS: {PH_BLUE}{get_os_info()}{RESET}")
            print(f"{PH_YELLOW}⬢ {PH_WHITE}Python: {PH_BLUE}{sys.version}{RESET}")
            print(f"{PH_YELLOW}⬢ {PH_WHITE}Docker installed: {PH_BLUE}{bool(run_command(['which', 'docker'], capture_output=True, check=False, show_output=False).returncode == 0)}{RESET}")
            print(f"{PH_YELLOW}⬢ {PH_WHITE}Docker Compose installed: {PH_BLUE}{bool(run_command(['which', 'docker-compose'], capture_output=True, check=False, show_output=False).returncode == 0)}{RESET}")
            print(f"{PH_YELLOW}⬢ {PH_WHITE}Docker running: {PH_BLUE}{check_docker()}{RESET}")
            return
        
        elif args.fix_docker:
            print_ph_header("Fixing Docker Credentials")
            fix_docker_credentials()
            print_colored("Done. Try running your containers now.", "blue")
            return
        
        elif args.start:
            # Determine which script to use
            if args.simple:
                print_ph_header("Starting Containers (Simple Mode)")
                start_with_simple_script(
                    show_logs=not args.no_logs,
                    open_browsers=not args.no_browser
                )
            elif args.advanced:
                print_ph_header("Starting Containers (Advanced Mode)")
                start_with_advanced_script(
                    show_logs=not args.no_logs,
                    open_browsers=not args.no_browser
                )
            else:
                # Default to advanced script
                print_ph_header("Starting Containers (Advanced Mode)")
                print_colored("Using advanced start script (with port management).", "white")
                start_with_advanced_script(
                    show_logs=not args.no_logs,
                    open_browsers=not args.no_browser
                )
        
        elif args.stop:
            print_ph_header("Stopping Containers")
            stop_containers()
        
        elif args.restart:
            print_ph_header("Restarting Containers")
            restart_containers()
        
        elif args.status:
            print_ph_header("Container Status")
            containers = get_container_status()
            if containers:
                for container in containers:
                    name = container.get("Name", "Unknown")
                    state = container.get("State", "Unknown")
                    ports = container.get("Ports", "No ports")
                    print_status_item(name, state, ports)
            else:
                print_colored("No containers found or unable to get status.", "yellow")
        
        elif args.logs:
            print_ph_header("Container Logs")
            view_logs()
    
    except KeyboardInterrupt:
        print_colored("\nOperation interrupted by user.", "yellow")
        sys.exit(1)
    except Exception as e:
        print_colored(f"\nUnexpected error: {str(e)}", "red")
        print_colored("For more information, run: python trigo_app_manager.py --system-info", "yellow")
        sys.exit(1)

if __name__ == "__main__":
    main() 