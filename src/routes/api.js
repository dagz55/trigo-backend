const express = require('express');
const router = express.Router();
const azureService = require('../services/azure');

// Azure status endpoint
router.get('/azure/status', async (req, res, next) => {
  try {
    const status = await azureService.getStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
});

// Azure login endpoint
router.post('/azure/login', async (req, res, next) => {
  try {
    const result = await azureService.login();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Azure logout endpoint
router.post('/azure/logout', async (req, res, next) => {
  try {
    const result = await azureService.logout();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
