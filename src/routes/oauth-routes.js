const express = require('express');
const router = express.Router();
const { oauth, oauth2callback } = require('../controllers/oauth-controllers');

router.get('/oauth', oauth);
router.get('/oauth2callback', oauth2callback);

module.exports = router;
