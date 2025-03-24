const express = require('express');
const router = express.Router();

// Get payment methods
router.get('/methods', (req, res) => {
  res.json({
    success: true,
    methods: [
      { id: 'card', name: 'Credit/Debit Card' },
      { id: 'wallet', name: 'Digital Wallet' },
      { id: 'cash', name: 'Cash' }
    ]
  });
});

// Process payment
router.post('/process', (req, res) => {
  const { amount, method, currency = 'USD' } = req.body;
  
  // Simulated payment processing
  res.json({
    success: true,
    transactionId: `TR-${Date.now()}`,
    amount,
    currency,
    method,
    status: 'completed',
    timestamp: new Date()
  });
});

module.exports = router; 