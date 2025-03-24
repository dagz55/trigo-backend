# TriGo App Management Documentation

This document explains the two scripts available for managing the TriGo app containers and provides guidance on which one to use in different scenarios.

## Available Scripts

### 1. start-apps.sh (Advanced)

This is the more advanced script with dynamic port management and additional features.

**Key Features:**
- **Automatic Port Management**: Checks if the default ports (3000, 3001, 3002) are available and automatically finds alternative ports if they're already in use
- **Docker Compose Configuration**: Dynamically updates the `docker-compose.yml` file with new ports when needed
- **Cleanup on Exit**: Restores the original `docker-compose.yml` file when the script exits
- **Browser Integration**: Automatically opens browser tabs for each application
- **Cross-Platform**: Includes specific handling for macOS, Linux, and Windows
- **Live Logs**: Shows container logs after starting the applications

**When to Use:**
- When you want a fully automated experience
- When you have potential port conflicts with other applications
- When you need the apps to open automatically in your browser
- When you prefer dynamic port allocation

### 2. start-containers.sh (Simple)

This is a simpler script focused on basic container management.

**Key Features:**
- **Docker Check**: Verifies that Docker is running before attempting to start containers
- **Container Cleanup**: Stops and removes any existing containers before starting
- **Container Health Check**: Verifies that all containers are running after startup
- **Fixed Ports**: Uses fixed ports (3000, 3001, 3002) without checking for conflicts
- **Status Display**: Shows container status after startup

**When to Use:**
- When you need a simpler, more straightforward approach
- When you know the default ports are available
- When you don't need automatic browser opening
- When you prefer fixed port allocation

## Comparison Table

| Feature | start-apps.sh | start-containers.sh |
|---------|--------------|---------------------|
| Port Management | Dynamic (finds available ports) | Fixed ports only |
| Docker Compose Config | Updates with new ports | Uses as-is |
| Browser Integration | Yes (auto-opens apps) | No |
| Cleanup on Exit | Yes (restores original config) | No |
| Docker Check | No | Yes |
| Container Health Check | No | Yes |
| Platform Support | macOS, Linux, Windows | All Unix-like |
| Default Ports | 3000, 3001, 3002 | 3000, 3001, 3002 |

## Python Script Manager (trigo_app_manager.py)

For convenience, we've created a Python script that allows you to manage both approaches through a simple command-line interface.

### Usage

```bash
# Start containers with the advanced script (default)
python trigo_app_manager.py --start

# Start containers with the simple script
python trigo_app_manager.py --start --simple

# Start containers with the advanced script explicitly
python trigo_app_manager.py --start --advanced

# Start without opening browsers
python trigo_app_manager.py --start --no-browser

# Start without showing logs
python trigo_app_manager.py --start --no-logs

# Stop all containers
python trigo_app_manager.py --stop

# Restart all containers
python trigo_app_manager.py --restart

# View container status
python trigo_app_manager.py --status

# View container logs
python trigo_app_manager.py --logs
```

### Installation

The Python script requires Python 3.6 or later. No additional dependencies are needed.

## Recommendation

- **For Development**: Use the advanced script (`start-apps.sh`) or the Python manager with `--start` for the most flexible development experience.
- **For Production/Demo**: Use the simple script (`start-containers.sh`) or the Python manager with `--start --simple` for a more predictable environment.
- **For Best Experience**: Use the Python manager script for the most control and convenience.

## Troubleshooting

If you encounter issues:

1. Make sure Docker is running
2. Check if other applications are using the default ports
3. View logs with `python trigo_app_manager.py --logs`
4. Check container status with `python trigo_app_manager.py --status` 