const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Azure Snapshot Manager API',
    version: '1.0.0',
    endpoints: {
      '/api/azure/status': 'Get Azure connection status',
      '/api/azure/login': 'Initiate Azure CLI login',
      '/api/azure/logout': 'Logout from Azure CLI'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
