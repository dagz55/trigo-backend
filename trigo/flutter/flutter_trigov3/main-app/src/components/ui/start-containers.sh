#!/bin/bash

# Build and start all containers
docker-compose up -d --build

echo "Containers are starting..."
echo "Passenger container: http://localhost:3000"
echo "Driver container: http://localhost:3001"
echo "Dispatcher container: http://localhost:3002"

