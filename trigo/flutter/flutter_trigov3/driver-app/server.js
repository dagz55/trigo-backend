const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import route modules
const rideRequestsRoutes = require('./routes/rideRequests');
const earningsRoutes = require('./routes/earnings');

// Use routes
app.use('/api/ride-requests', rideRequestsRoutes);
app.use('/api/driver/earnings', earningsRoutes);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Driver server running on port ${PORT}`);
}); 