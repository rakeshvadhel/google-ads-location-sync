// src/routes/googleAdsRoutes.js
const express = require('express');
const { getCustomerInfo, getActiveCampaigns } = require('../services/googleAdsService');

const router = express.Router();

router.get('/customer', async (req, res) => {
  try {
    const info = await getCustomerInfo();
    res.json(info);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customer info' });
  }
});

router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await getActiveCampaigns();
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

module.exports = router;
