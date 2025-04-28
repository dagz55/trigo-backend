require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://passenger.trigo.com', 'https://driver.trigo.com', 'https://dispatcher.trigo.com'] 
      : '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://passenger.trigo.com', 'https://driver.trigo.com', 'https://dispatcher.trigo.com'] 
    : '*',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint - API information
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'TriGo API Server',
    version: '1.0.0',
    description: 'Backend API for TriGo ride-hailing service',
    endpoints: {
      health: '/health'
    }
  });
});

// Start server
const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`⚡️ TriGo API Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Documentation available at root endpoint: http://localhost:${PORT}/`);
});
