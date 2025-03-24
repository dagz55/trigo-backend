const express = require('express');
const router = express.Router();

// Get driver earnings summary
router.get('/summary', (req, res) => {
  res.json({
    success: true,
    earnings: {
      today: 85.50,
      thisWeek: 425.75,
      thisMonth: 1850.25,
      pendingPayout: 425.75,
      lastPayout: {
        amount: 1425.50,
        date: '2024-03-10'
      }
    }
  });
});

// Get earnings history
router.get('/history', (req, res) => {
  res.json({
    success: true,
    history: [
      {
        date: '2024-03-16',
        rides: 8,
        earnings: 85.50,
        tips: 12.00,
        total: 97.50
      },
      {
        date: '2024-03-15',
        rides: 10,
        earnings: 105.25,
        tips: 15.50,
        total: 120.75
      },
      {
        date: '2024-03-14',
        rides: 7,
        earnings: 75.00,
        tips: 10.00,
        total: 85.00
      },
      {
        date: '2024-03-13',
        rides: 9,
        earnings: 95.75,
        tips: 14.25,
        total: 110.00
      },
      {
        date: '2024-03-12',
        rides: 6,
        earnings: 65.25,
        tips: 8.50,
        total: 73.75
      }
    ]
  });
});

// Get payout methods
router.get('/payout-methods', (req, res) => {
  res.json({
    success: true,
    methods: [
      {
        id: 'bank-1',
        type: 'bank_account',
        name: 'Primary Bank Account',
        last4: '4567',
        isDefault: true
      },
      {
        id: 'card-1',
        type: 'debit_card',
        name: 'Debit Card',
        last4: '8901',
        isDefault: false
      }
    ]
  });
});

module.exports = router; 