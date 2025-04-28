# TriGo Backend

Backend server and utilities for the TriGo ride-hailing platform.

## Overview

This repository contains the backend server and utilities for the TriGo ride-hailing platform. It includes the following components:

- Backend API Server (Node.js/Express)
- Utility scripts for development and deployment
- Configuration files

## Directory Structure

```
/
|-- scripts/                  # Utility scripts for development and deployment
|   |-- start_servers.py      # Script to start all servers
|-- src/                      # Source code for the backend server
|-- config/                   # Configuration files
|-- docs/                     # Documentation
|-- .env.example              # Example environment variables
|-- README.md                 # This file
```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/dagz55/trigo-backend.git
   cd trigo-backend
   ```

2. Install dependencies:
   ```bash
   cd src
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the servers:
   ```bash
   python3 scripts/start_servers.py
   ```

## Starting the Servers

The `start_servers.py` script starts all three TriGo servers:

1. Backend API Server (project directory) - Port 3002
2. Passenger Web App (temp directory) - Port 3000
3. Trider/Monitoring App (monitoring-app-trigo directory) - Port 3001

Features of the script:

- Detects and kills existing processes using the required ports
- Prompts for user confirmation before taking actions
- Handles error detection and provides clear logging
- Ensures proper shutdown of all servers
- Automatically installs dependencies if needed
- Creates .env files from examples if needed
- Monitors and restarts crashed servers

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT
