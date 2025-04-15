// const dotenv = require('dotenv');
// const express = require('express');
// const bodyParser = require("body-parser");

// const app = express();

// // Load environment variables from .env file
// dotenv.config();

// // Body parser middleware
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json());

// // index route
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);
// });




require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const { getAccessToken } = require('../utils/googleAuth');
const { resolveGeoTargets } = require('../utils/geoUtils');
const { GoogleAdsApi } = require('google-ads-api');

const app = express();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/adwords'];

// Step 1: Generate auth URL
app.get('/', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });

  res.send(`
    <h2>Google Ads OAuth2</h2>
    <a href="${authUrl}">Click here to authorize access</a>
  `);
});

// Step 2: Handle redirect and exchange code for tokens
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No code found in query');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('✅ Access Token:', tokens.access_token);
    console.log('✅ Refresh Token:', tokens.refresh_token);

    res.send(`
      <h2>Authorization successful!</h2>
      <p>Check your terminal for the refresh token.</p>
    `);
  } catch (err) {
    console.error('Error retrieving access token', err);
    res.status(500).send('Failed to retrieve tokens');
  }
});

const getActiveCampaigns = async (customer) => {
  const campaigns = [];

  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status
    FROM campaign
    WHERE campaign.status = 'ENABLED'
  `;

  const campaignIterator = await customer.query(query);

  for await (const row of campaignIterator) {
    campaigns.push({
      id: row.campaign.id,
      name: row.campaign.name,
      status: row.campaign.status,
    });
  }

  return campaigns;
};


app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
