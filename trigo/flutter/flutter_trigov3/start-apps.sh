#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Default ports
DEFAULT_PASSENGER_PORT=3000
DEFAULT_DRIVER_PORT=3001
DEFAULT_DISPATCHER_PORT=3002

# Actual ports to be used (will be changed if defaults are unavailable)
PASSENGER_PORT=$DEFAULT_PASSENGER_PORT
DRIVER_PORT=$DEFAULT_DRIVER_PORT
DISPATCHER_PORT=$DEFAULT_DISPATCHER_PORT

# Fix Docker credential issues - especially important for RHEL
fix_docker_credentials() {
  local config_file=~/.docker/config.json
  local config_dir=~/.docker
  
  # Create docker directory if it doesn't exist
  mkdir -p "$config_dir"
  
  # Create a simple config with no credential helper
  echo '{"auths":{}}' > "$config_file"
  
  echo -e "${GREEN}Docker credential configuration updated.${NC}"
}

# Check if running on RHEL
is_rhel() {
  if [ -f /etc/redhat-release ]; then
    grep -q "Red Hat Enterprise Linux" /etc/redhat-release
    return $?
  fi
  return 1
}

# Detect which Docker Compose command to use
detect_docker_compose_cmd() {
  if command -v docker-compose &> /dev/null; then
    echo "docker-compose"
  else
    echo "docker compose"
  fi
}

# Function to check if a port is available
check_port() {
  local port=$1
  local service_name=$2
  
  echo -e "${YELLOW}Checking if port $port is available for $service_name...${NC}"
  
  if command -v lsof > /dev/null; then
    if lsof -i :$port > /dev/null 2>&1; then
      echo -e "${RED}Port $port is already in use!${NC}"
      return 1
    fi
  elif command -v netstat > /dev/null; then
    if netstat -tuln | grep ":$port " > /dev/null 2>&1; then
      echo -e "${RED}Port $port is already in use!${NC}"
      return 1
    fi
  else
    echo -e "${YELLOW}Warning: Cannot check port availability (lsof or netstat not found)${NC}"
    # Try a direct socket connection test
    (echo > /dev/tcp/localhost/$port) 2>/dev/null && {
      echo -e "${RED}Port $port is already in use!${NC}"
      return 1
    }
  fi
  
  echo -e "${GREEN}Port $port is available.${NC}"
  return 0
}

# Function to find an available port starting from the provided one
find_available_port() {
  local start_port=$1
  local max_attempts=10
  local current_port=$start_port
  
  for (( i=0; i<max_attempts; i++ )); do
    # Suppress standard output to avoid polluting port number output
    if check_port $current_port "service" > /dev/null 2>&1; then
      # Just output the port number without any other text
      echo "$current_port"
      return 0
    fi
    
    current_port=$((current_port+1))
  done
  
  echo -e "${RED}Failed to find an available port after $max_attempts attempts.${NC}" >&2
  return 1
}

# Function to update docker-compose.yml with new ports
update_docker_compose() {
  local file="docker-compose.yml"
  local backup_file="docker-compose.yml.bak"
  
  echo -e "${YELLOW}Updating docker-compose.yml with new ports...${NC}"
  
  # Backup the original file
  cp "$file" "$backup_file"
  
  # Use sed to replace the ports in the docker-compose.yml file
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS requires a different sed syntax
    sed -i '' "s/- \"$DEFAULT_PASSENGER_PORT:3000\"/- \"$PASSENGER_PORT:3000\"/g" "$file"
    sed -i '' "s/- \"$DEFAULT_DRIVER_PORT:3000\"/- \"$DRIVER_PORT:3000\"/g" "$file"
    sed -i '' "s/- \"$DEFAULT_DISPATCHER_PORT:3000\"/- \"$DISPATCHER_PORT:3000\"/g" "$file"
  else
    # Linux and other Unix-like systems
    sed -i "s/- \"$DEFAULT_PASSENGER_PORT:3000\"/- \"$PASSENGER_PORT:3000\"/g" "$file"
    sed -i "s/- \"$DEFAULT_DRIVER_PORT:3000\"/- \"$DRIVER_PORT:3000\"/g" "$file"
    sed -i "s/- \"$DEFAULT_DISPATCHER_PORT:3000\"/- \"$DISPATCHER_PORT:3000\"/g" "$file"
  fi
  
  echo -e "${GREEN}docker-compose.yml updated successfully.${NC}"
}

# Check and assign available ports
find_ports() {
  echo -e "${YELLOW}Checking port availability...${NC}"
  
  # Check and find available ports for each service
  if ! check_port $PASSENGER_PORT "Passenger App"; then
    # Get only the port number without status messages
    PASSENGER_PORT=$(find_available_port $PASSENGER_PORT)
    if [ $? -ne 0 ]; then
      echo -e "${RED}Failed to find an available port for Passenger App.${NC}"
      exit 1
    fi
    echo -e "${GREEN}Assigned port $PASSENGER_PORT to Passenger App.${NC}"
  fi
  
  if ! check_port $DRIVER_PORT "Driver App"; then
    DRIVER_PORT=$(find_available_port $DRIVER_PORT)
    if [ $? -ne 0 ]; then
      echo -e "${RED}Failed to find an available port for Driver App.${NC}"
      exit 1
    fi
    echo -e "${GREEN}Assigned port $DRIVER_PORT to Driver App.${NC}"
  fi
  
  if ! check_port $DISPATCHER_PORT "Dispatcher App"; then
    DISPATCHER_PORT=$(find_available_port $DISPATCHER_PORT)
    if [ $? -ne 0 ]; then
      echo -e "${RED}Failed to find an available port for Dispatcher App.${NC}"
      exit 1
    fi
    echo -e "${GREEN}Assigned port $DISPATCHER_PORT to Dispatcher App.${NC}"
  fi
  
  # If any port changed, update docker-compose.yml
  if [[ "$PASSENGER_PORT" != "$DEFAULT_PASSENGER_PORT" || "$DRIVER_PORT" != "$DEFAULT_DRIVER_PORT" || "$DISPATCHER_PORT" != "$DEFAULT_DISPATCHER_PORT" ]]; then
    update_docker_compose
  fi
}

# Function to handle cleanup on script exit
cleanup() {
  echo -e "\n${YELLOW}Cleaning up...${NC}"
  
  # Restore the original docker-compose.yml if we changed it
  if [ -f "docker-compose.yml.bak" ]; then
    echo -e "${YELLOW}Restoring original docker-compose.yml...${NC}"
    mv "docker-compose.yml.bak" "docker-compose.yml"
  fi
  
  echo -e "${GREEN}Cleanup complete.${NC}"
}

# Register cleanup function to run on script exit
trap cleanup EXIT

# Get the appropriate Docker Compose command
DOCKER_COMPOSE_CMD=$(detect_docker_compose_cmd)

# Main script execution

echo -e "${GREEN}====== Starting Trigo Apps ======${NC}"

# Fix Docker credentials on RHEL
if is_rhel; then
  echo -e "${YELLOW}Running on RHEL. Fixing Docker credentials...${NC}"
  fix_docker_credentials
fi

# Find available ports
find_ports

# Check if Docker is running
if ! docker info &> /dev/null; then
  echo -e "${RED}Error: Docker is not running.${NC}"
  if is_rhel; then
    echo -e "${YELLOW}Start Docker with: sudo systemctl start docker${NC}"
  else
    echo -e "${YELLOW}Please start Docker and try again.${NC}"
  fi
  exit 1
fi

# Build and start all applications
echo -e "${YELLOW}Building and starting applications...${NC}"
$DOCKER_COMPOSE_CMD down > /dev/null 2>&1
$DOCKER_COMPOSE_CMD up --build -d

# Check if containers started successfully
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to start containers. Check docker-compose logs for details.${NC}"
  $DOCKER_COMPOSE_CMD logs
  exit 1
fi

echo -e "${GREEN}Containers started successfully.${NC}"

# Wait for containers to be ready
echo -e "${YELLOW}Waiting for applications to initialize (10 seconds)...${NC}"
sleep 10

# Print the URLs for each application
echo -e "\n${GREEN}====== Application URLs ======${NC}"
echo -e "Passenger App: ${GREEN}http://localhost:$PASSENGER_PORT${NC}"
echo -e "Driver App:    ${GREEN}http://localhost:$DRIVER_PORT${NC}"
echo -e "Dispatcher App: ${GREEN}http://localhost:$DISPATCHER_PORT${NC}"

# Open browsers for each application
echo -e "\n${YELLOW}Opening applications in browser...${NC}"

if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  open "http://localhost:$PASSENGER_PORT"  # Passenger App
  open "http://localhost:$DRIVER_PORT"     # Driver App
  open "http://localhost:$DISPATCHER_PORT" # Dispatcher App
elif [[ "$OSTYPE" == "linux-gnu"* ]] || is_rhel; then
  # Linux/RHEL - try multiple browser commands
  for browser in xdg-open gnome-open firefox google-chrome chromium-browser; do
    if command -v $browser &> /dev/null; then
      $browser "http://localhost:$PASSENGER_PORT" &> /dev/null &
      $browser "http://localhost:$DRIVER_PORT" &> /dev/null &
      $browser "http://localhost:$DISPATCHER_PORT" &> /dev/null &
      break
    fi
  done
  
  if ! command -v xdg-open &> /dev/null && ! command -v gnome-open &> /dev/null && \
     ! command -v firefox &> /dev/null && ! command -v google-chrome &> /dev/null && \
     ! command -v chromium-browser &> /dev/null; then
    echo -e "${YELLOW}No browser command found. Please open these URLs manually:${NC}"
    echo -e "Passenger App: ${GREEN}http://localhost:$PASSENGER_PORT${NC}"
    echo -e "Driver App:    ${GREEN}http://localhost:$DRIVER_PORT${NC}"
    echo -e "Dispatcher App: ${GREEN}http://localhost:$DISPATCHER_PORT${NC}"
  fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
  # Windows
  start "http://localhost:$PASSENGER_PORT"  # Passenger App
  start "http://localhost:$DRIVER_PORT"     # Driver App
  start "http://localhost:$DISPATCHER_PORT" # Dispatcher App
else
  echo -e "${YELLOW}Unsupported OS for automatic browser opening. Please open these URLs manually:${NC}"
  echo -e "Passenger App: ${GREEN}http://localhost:$PASSENGER_PORT${NC}"
  echo -e "Driver App:    ${GREEN}http://localhost:$DRIVER_PORT${NC}"
  echo -e "Dispatcher App: ${GREEN}http://localhost:$DISPATCHER_PORT${NC}"
fi

# Show logs
echo -e "\n${GREEN}====== Application Logs ======${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop viewing logs (applications will continue running)${NC}"
$DOCKER_COMPOSE_CMD logs -f 