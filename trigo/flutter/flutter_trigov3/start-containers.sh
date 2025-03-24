#!/bin/bash
set -eo pipefail

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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

# Get the appropriate Docker Compose command
DOCKER_COMPOSE_CMD=$(detect_docker_compose_cmd)

echo -e "${YELLOW}Starting TriGo Containerized Services...${NC}"

# Fix Docker credentials on RHEL
if is_rhel; then
  echo -e "${YELLOW}Running on RHEL. Fixing Docker credentials...${NC}"
  fix_docker_credentials
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Error: Docker is not running.${NC}"
  if is_rhel; then
    echo -e "${YELLOW}Start Docker with: sudo systemctl start docker${NC}"
  else
    echo -e "${YELLOW}Please start Docker and try again.${NC}"
  fi
  exit 1
fi

# Clean up any existing containers to ensure fresh start
echo -e "${YELLOW}Stopping any existing containers...${NC}"
$DOCKER_COMPOSE_CMD down --remove-orphans

# Build and start all containers
echo -e "${YELLOW}Building and starting containers...${NC}"
$DOCKER_COMPOSE_CMD up -d --build

# Wait for containers to be healthy
echo -e "${YELLOW}Waiting for containers to become healthy...${NC}"
sleep 10

# Check if containers are running
container_count=$($DOCKER_COMPOSE_CMD ps -q | wc -l)
if [ "$container_count" -ne "3" ]; then
  echo -e "${RED}Error: Not all containers are running.${NC}"
  echo -e "${YELLOW}Checking container status...${NC}"
  $DOCKER_COMPOSE_CMD ps
  echo -e "${YELLOW}Container logs:${NC}"
  $DOCKER_COMPOSE_CMD logs
  exit 1
fi

echo -e "${GREEN}All containers are running!${NC}"
echo -e "${GREEN}Passenger container: http://localhost:3000${NC}"
echo -e "${GREEN}Driver container: http://localhost:3001${NC}"
echo -e "${GREEN}Dispatcher container: http://localhost:3002${NC}"

# Print the status of all containers
echo -e "${YELLOW}Container Status:${NC}"
$DOCKER_COMPOSE_CMD ps

echo -e "${YELLOW}You can view logs with: $DOCKER_COMPOSE_CMD logs -f${NC}"

# Try to open browsers on RHEL/Linux
if [[ "$OSTYPE" == "linux-gnu"* ]] || is_rhel; then
  echo -e "${YELLOW}Attempting to open applications in browser...${NC}"
  # Try multiple browser commands
  for browser in xdg-open gnome-open firefox google-chrome chromium-browser; do
    if command -v $browser &> /dev/null; then
      $browser "http://localhost:3000" &> /dev/null &
      $browser "http://localhost:3001" &> /dev/null &
      $browser "http://localhost:3002" &> /dev/null &
      echo -e "${GREEN}Opened applications in $browser${NC}"
      break
    fi
  done
fi

