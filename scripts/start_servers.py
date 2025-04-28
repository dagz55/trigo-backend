#!/usr/bin/env python3

import os
import sys
import subprocess
import signal
import time
import platform
import socket
import atexit
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("TriGo-Servers")

# Define the base directory
BASE_DIR = Path(os.path.dirname(os.path.abspath(__file__)))
PASSENGER_DIR = BASE_DIR / "temp"
MONITORING_DIR = BASE_DIR / "monitoring-app-trigo"
SERVER_DIR = BASE_DIR / "project"

# Define server ports
PASSENGER_PORT = 3000  # Passenger app
MONITORING_PORT = 3001  # Trider/Monitoring app
SERVER_PORT = 3002  # Backend server

# Store process objects
processes = {}

def is_port_in_use(port):
    """Check if a port is already in use."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def check_node_installed():
    """Check if Node.js is installed."""
    try:
        subprocess.run(["node", "--version"], capture_output=True, check=True)
        return True
    except (subprocess.SubprocessError, FileNotFoundError):
        logger.error("Node.js is not installed or not in PATH. Please install Node.js.")
        return False

def check_npm_installed():
    """Check if npm is installed."""
    try:
        subprocess.run(["npm", "--version"], capture_output=True, check=True)
        return True
    except (subprocess.SubprocessError, FileNotFoundError):
        logger.error("npm is not installed or not in PATH. Please install npm.")
        return False

def check_directory_exists(directory, name):
    """Check if a directory exists."""
    if not directory.exists():
        logger.error(f"{name} directory not found at {directory}")
        return False
    return True

def check_package_json(directory, name):
    """Check if package.json exists in the directory."""
    if not (directory / "package.json").exists():
        logger.error(f"package.json not found in {name} directory at {directory}")
        return False
    return True

def install_dependencies(directory, name):
    """Install npm dependencies if needed."""
    logger.info(f"Checking dependencies for {name}...")

    # Check if node_modules exists
    if not (directory / "node_modules").exists():
        logger.info(f"Installing dependencies for {name}...")
        try:
            subprocess.run(
                ["npm", "install"],
                cwd=directory,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            logger.info(f"Dependencies installed for {name}")
        except subprocess.SubprocessError as e:
            logger.error(f"Failed to install dependencies for {name}: {e}")
            return False
    return True

def check_env_file(directory, name):
    """Check if .env file exists, create from example if needed."""
    env_file = directory / ".env"
    env_example = directory / ".env.example"

    if not env_file.exists() and env_example.exists():
        logger.warning(f".env file not found for {name}, creating from .env.example")
        try:
            with open(env_example, 'r') as example_file:
                example_content = example_file.read()

            with open(env_file, 'w') as env_file_obj:
                env_file_obj.write(example_content)

            logger.info(f"Created .env file for {name} from .env.example")
        except Exception as e:
            logger.error(f"Failed to create .env file for {name}: {e}")
            return False
    return True

def start_server(directory, name, port, command):
    """Start a server process."""
    if is_port_in_use(port):
        logger.error(f"Port {port} is already in use. Cannot start {name}.")
        return None

    logger.info(f"Starting {name} on port {port}...")

    # Determine the shell setting based on platform
    use_shell = platform.system() == "Windows"

    try:
        # Create a new process group on Unix-like systems
        if platform.system() != "Windows":
            process = subprocess.Popen(
                command,
                cwd=directory,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=use_shell,
                preexec_fn=os.setsid  # Create a new process group on Unix
            )
        else:
            # On Windows, use a different approach
            process = subprocess.Popen(
                command,
                cwd=directory,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=use_shell,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
            )

        # Start log monitoring threads
        start_log_monitor(process, name)

        logger.info(f"{name} started successfully (PID: {process.pid})")
        return process
    except Exception as e:
        logger.error(f"Failed to start {name}: {e}")
        return None

def start_log_monitor(process, name):
    """Start a thread to monitor and log process output."""
    import threading

    def monitor_output(stream, level):
        for line in iter(stream.readline, ''):
            if line.strip():
                if level == logging.INFO:
                    logger.info(f"[{name}] {line.strip()}")
                else:
                    logger.error(f"[{name}] {line.strip()}")

    # Start stdout monitor
    stdout_thread = threading.Thread(
        target=monitor_output,
        args=(process.stdout, logging.INFO),
        daemon=True
    )
    stdout_thread.start()

    # Start stderr monitor
    stderr_thread = threading.Thread(
        target=monitor_output,
        args=(process.stderr, logging.ERROR),
        daemon=True
    )
    stderr_thread.start()

def get_user_confirmation(message):
    """Prompt the user for confirmation."""
    while True:
        response = input(f"{message} (y/n): ").strip().lower()
        if response in ['y', 'yes']:
            return True
        elif response in ['n', 'no']:
            return False
        else:
            print("Please enter 'y' or 'n'.")

def find_and_kill_processes_on_ports(ports):
    """Find and kill processes using the specified ports."""
    killed_processes = []

    for port in ports:
        if is_port_in_use(port):
            logger.info(f"Port {port} is in use. Attempting to identify the process...")

            # Use lsof to find the process using the port (macOS/Linux)
            if platform.system() != "Windows":
                try:
                    # Find process using the port
                    result = subprocess.run(
                        ["lsof", "-i", f":{port}", "-t"],
                        capture_output=True,
                        text=True,
                        check=False
                    )

                    if result.stdout.strip():
                        pid = int(result.stdout.strip().split("\n")[0])

                        # Get process name
                        proc_info = subprocess.run(
                            ["ps", "-p", str(pid), "-o", "comm="],
                            capture_output=True,
                            text=True,
                            check=False
                        )
                        proc_name = proc_info.stdout.strip()

                        logger.info(f"Found process {proc_name} (PID: {pid}) using port {port}")
                        killed_processes.append((pid, proc_name, port))

                        # Kill the process
                        logger.info(f"Killing process {proc_name} (PID: {pid})...")
                        os.kill(pid, signal.SIGTERM)

                        # Wait for process to terminate
                        for _ in range(10):
                            try:
                                # Check if process still exists
                                os.kill(pid, 0)
                                time.sleep(0.5)
                            except OSError:
                                # Process is gone
                                break

                        # Force kill if still running
                        try:
                            os.kill(pid, 0)
                            logger.warning(f"Process {pid} did not terminate gracefully, forcing...")
                            os.kill(pid, signal.SIGKILL)
                        except OSError:
                            # Process is already gone
                            pass

                        logger.info(f"Process {proc_name} (PID: {pid}) terminated")
                except Exception as e:
                    logger.error(f"Error killing process on port {port}: {e}")
            else:
                # Windows version using netstat and taskkill
                try:
                    # Find process using the port
                    result = subprocess.run(
                        ["netstat", "-ano", "|", "findstr", f":{port}"],
                        capture_output=True,
                        text=True,
                        shell=True,
                        check=False
                    )

                    if result.stdout.strip():
                        lines = result.stdout.strip().split("\n")
                        for line in lines:
                            if f":{port}" in line:
                                parts = line.strip().split()
                                if len(parts) >= 5:
                                    pid = int(parts[-1])

                                    # Get process name
                                    proc_info = subprocess.run(
                                        ["tasklist", "/FI", f"PID eq {pid}", "/FO", "CSV"],
                                        capture_output=True,
                                        text=True,
                                        check=False
                                    )

                                    proc_lines = proc_info.stdout.strip().split("\n")
                                    if len(proc_lines) >= 2:
                                        proc_parts = proc_lines[1].split(",")
                                        if len(proc_parts) >= 2:
                                            proc_name = proc_parts[0].strip('"')

                                            logger.info(f"Found process {proc_name} (PID: {pid}) using port {port}")
                                            killed_processes.append((pid, proc_name, port))

                                            # Kill the process
                                            logger.info(f"Killing process {proc_name} (PID: {pid})...")
                                            subprocess.run(
                                                ["taskkill", "/PID", str(pid), "/F"],
                                                capture_output=True,
                                                check=False
                                            )

                                            logger.info(f"Process {proc_name} (PID: {pid}) terminated")
                                            break
                except Exception as e:
                    logger.error(f"Error killing process on port {port}: {e}")

    return killed_processes

def cleanup():
    """Clean up all processes on exit."""
    logger.info("Shutting down all servers...")

    for name, process in processes.items():
        if process and process.poll() is None:  # If process exists and is still running
            logger.info(f"Terminating {name}...")
            try:
                if platform.system() != "Windows":
                    # Send SIGTERM to the process group on Unix
                    os.killpg(os.getpgid(process.pid), signal.SIGTERM)
                else:
                    # On Windows, terminate the process
                    process.terminate()

                # Wait for up to 5 seconds for the process to terminate
                for _ in range(10):
                    if process.poll() is not None:
                        break
                    time.sleep(0.5)

                # If still running, force kill
                if process.poll() is None:
                    logger.warning(f"{name} did not terminate gracefully, forcing...")
                    if platform.system() != "Windows":
                        os.killpg(os.getpgid(process.pid), signal.SIGKILL)
                    else:
                        process.kill()
            except Exception as e:
                logger.error(f"Error terminating {name}: {e}")

    logger.info("All servers shut down")

def main():
    """Main function to start all servers."""
    # Register cleanup handler
    atexit.register(cleanup)

    # Check prerequisites
    if not check_node_installed() or not check_npm_installed():
        return 1

    # Check server directories
    if not all([
        check_directory_exists(SERVER_DIR, "Backend Server"),
        check_directory_exists(PASSENGER_DIR, "Passenger App"),
        check_directory_exists(MONITORING_DIR, "Trider App")
    ]):
        return 1

    # Check package.json files
    if not all([
        check_package_json(SERVER_DIR, "Backend Server"),
        check_package_json(PASSENGER_DIR, "Passenger App"),
        check_package_json(MONITORING_DIR, "Trider App")
    ]):
        return 1

    # Install dependencies if needed
    if not all([
        install_dependencies(SERVER_DIR, "Backend Server"),
        install_dependencies(PASSENGER_DIR, "Passenger App"),
        install_dependencies(MONITORING_DIR, "Trider App")
    ]):
        return 1

    # Check/create .env files
    check_env_file(SERVER_DIR, "Backend Server")

    # Check if any of the required ports are in use
    ports_to_check = [SERVER_PORT, PASSENGER_PORT, MONITORING_PORT]
    ports_in_use = [port for port in ports_to_check if is_port_in_use(port)]

    if ports_in_use:
        logger.warning("The following ports are already in use:")
        for port in ports_in_use:
            if port == SERVER_PORT:
                logger.warning(f"  - Port {port} (Backend Server)")
            elif port == PASSENGER_PORT:
                logger.warning(f"  - Port {port} (Passenger App)")
            elif port == MONITORING_PORT:
                logger.warning(f"  - Port {port} (Trider App)")

        # Ask for confirmation to kill existing processes
        if get_user_confirmation("Do you want to kill the processes using these ports?"):
            killed_processes = find_and_kill_processes_on_ports(ports_in_use)

            if killed_processes:
                logger.info("The following processes were terminated:")
                for pid, name, port in killed_processes:
                    logger.info(f"  - {name} (PID: {pid}) on port {port}")
            else:
                logger.warning("No processes were terminated. Ports may still be in use.")
                return 1
        else:
            logger.info("Operation cancelled by user.")
            return 1

    # Ask for confirmation before starting servers
    if not get_user_confirmation("Do you want to start all three servers?"):
        logger.info("Operation cancelled by user.")
        return 1

    # Start the backend server
    logger.info("Starting Backend Server...")
    server_process = start_server(
        SERVER_DIR,
        "Backend Server",
        SERVER_PORT,
        ["npm", "run", "dev"]
    )
    if server_process:
        processes["Backend Server"] = server_process
    else:
        return 1

    # Give the server a moment to start
    time.sleep(2)

    # Start the passenger app
    logger.info("Starting Passenger App...")
    passenger_process = start_server(
        PASSENGER_DIR,
        "Passenger App",
        PASSENGER_PORT,
        ["npm", "run", "dev", "--", "--port", str(PASSENGER_PORT)]
    )
    if passenger_process:
        processes["Passenger App"] = passenger_process

    # Start the trider app on a different port
    logger.info("Starting Trider App...")
    monitoring_process = start_server(
        MONITORING_DIR,
        "Trider App",
        MONITORING_PORT,
        ["npm", "run", "dev", "--", "--port", str(MONITORING_PORT)]
    )
    if monitoring_process:
        processes["Trider App"] = monitoring_process

    logger.info("All servers started successfully")
    logger.info(f"Backend Server running at: http://localhost:{SERVER_PORT}")
    logger.info(f"Passenger App running at: http://localhost:{PASSENGER_PORT}")
    logger.info(f"Trider App running at: http://localhost:{MONITORING_PORT}")

    try:
        # Keep the script running until interrupted
        while True:
            # Check if any process has terminated unexpectedly
            for name, process in list(processes.items()):
                if process.poll() is not None:
                    exit_code = process.poll()
                    logger.error(f"{name} terminated unexpectedly with exit code {exit_code}")

                    # Try to restart the process
                    logger.info(f"Attempting to restart {name}...")
                    if name == "Backend Server":
                        new_process = start_server(
                            SERVER_DIR,
                            "Backend Server",
                            SERVER_PORT,
                            ["npm", "run", "dev"]
                        )
                    elif name == "Passenger App":
                        new_process = start_server(
                            PASSENGER_DIR,
                            "Passenger App",
                            PASSENGER_PORT,
                            ["npm", "run", "dev", "--", "--port", str(PASSENGER_PORT)]
                        )
                    elif name == "Trider App":
                        new_process = start_server(
                            MONITORING_DIR,
                            "Trider App",
                            MONITORING_PORT,
                            ["npm", "run", "dev", "--", "--port", str(MONITORING_PORT)]
                        )

                    if new_process:
                        processes[name] = new_process
                        logger.info(f"{name} restarted successfully")
                    else:
                        logger.error(f"Failed to restart {name}")

            time.sleep(5)
    except KeyboardInterrupt:
        logger.info("Received keyboard interrupt, shutting down...")
    finally:
        cleanup()

    return 0

if __name__ == "__main__":
    sys.exit(main())
