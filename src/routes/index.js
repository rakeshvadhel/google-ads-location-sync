const express = require('express');
const router = express.Router();
const { customers, campaigns } = require('../controllers');

router.get('/customers', customers);
router.get('/campaigns', campaigns);

module.exports = router;