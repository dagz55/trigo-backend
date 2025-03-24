const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_sample');

// Get all tickets
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ticketing system operational',
    tickets: [
      { id: 1, type: 'Standard', price: 10.00 },
      { id: 2, type: 'Premium', price: 15.00 },
      { id: 3, type: 'Day Pass', price: 25.00 }
    ]
  });
});

// Create a payment intent
router.post('/payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

module.exports = router; 