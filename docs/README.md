# TriGo Backend Documentation

This directory contains documentation for the TriGo backend server.

## API Documentation

### Health Check
- `GET /health` - Check if the server is running
  - Response: `{ "status": "ok", "timestamp": "2023-04-28T12:34:56.789Z" }`

### Root Endpoint
- `GET /` - Get API information
  - Response: 
    ```json
    {
      "name": "TriGo API Server",
      "version": "1.0.0",
      "description": "Backend API for TriGo ride-hailing service",
      "endpoints": {
        "health": "/health"
      }
    }
    ```

## Server Configuration

The server can be configured using environment variables. See the `.env.example` file for available options.

## Development

To start the server in development mode:

```bash
cd src
npm run dev
```

## Production

To start the server in production mode:

```bash
cd src
npm start
```
