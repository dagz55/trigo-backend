const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const path = require('path');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import route modules
const ticketingRoutes = require('./routes/ticketing');
const paymentRoutes = require('./routes/payment');
const ratingsRoutes = require('./routes/ratings');
const popularPlacesRoutes = require('./routes/popularPlaces');
const analyticsRoutes = require('./routes/analytics');

// Use routes
app.use('/api/ticketing', ticketingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/popular-places', popularPlacesRoutes);
app.use('/api/analytics', analyticsRoutes);

// Socket.io setup for real-time tracking
io.on('connection', (socket) => {
  console.log('Dispatcher connected:', socket.id);

  const interval = setInterval(() => {
    const rideUpdate = {
      rideId: 'RIDE-12345',
      status: 'En Route',
      location: { lat: 14.5995, lng: 120.9842 },
      timestamp: new Date(),
    };
    socket.emit('rideUpdate', rideUpdate);
  }, 5000);

  socket.on('disconnect', () => {
    console.log('Dispatcher disconnected:', socket.id);
    clearInterval(interval);
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Dispatcher server running on port ${PORT}`);
}); 