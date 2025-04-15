// src/app.js
const express = require('express');
const googleAdsRoutes = require('./routes/googleAdsRoutes');

const app = express();
app.use(express.json());

app.use('/api', googleAdsRoutes);

module.exports = app;
