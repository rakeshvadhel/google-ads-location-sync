require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const { GoogleAdsApi } = require('google-ads-api');
const app = express();

app.use(express.json());

const getAccessToken = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  const { token } = await oauth2Client.getAccessToken();
  return token;
};

const getActiveCampaigns = async (customer) => {
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status
    FROM campaign
    WHERE campaign.status = 'ENABLED'
  `;

  const campaigns = [];
  const response = await customer.query(query);

  for await (const row of response) {
    campaigns.push({
      id: row.campaign.id,
      name: row.campaign.name,
      status: row.campaign.status,
    });
  }

  return campaigns;
};

const syncLocationHandler = async (locations, dryRun = false) => {
  const accessToken = await getAccessToken();
  const customerId = process.env.CUSTOMER_ID;

  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    developer_token: process.env.DEVELOPER_TOKEN,
  });

  const customer = client.Customer({
    customer_id: customerId,
    access_token: accessToken,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    login_customer_id: process.env.LOGIN_CUSTOMER_ID || undefined,
  });

  const resolvedLocations = []; // temporarily skip geo resolve step for now
  const campaigns = await getActiveCampaigns(customer);

  return {
    message: dryRun ? 'Dry run: campaigns fetched' : 'Campaign sync ready',
    dryRun,
    campaigns,
    resolvedLocations,
  };
};

app.get('/', async (req, res) => {
    try {
      const accessToken = await getAccessToken();
      const customerId = process.env.CUSTOMER_ID;
  
      const ads = google.ads({
        version: 'v13',
        auth: accessToken,
      });
  
      const response = await ads.customers.search({
        customerId: customerId,
        query: `
          SELECT
            campaign.id,
            campaign.name,
            campaign.status
          FROM campaign
          WHERE campaign.status = 'ENABLED'
        `,
      });
  
      const campaigns = response.data.results.map(row => ({
        id: row.campaign.id,
        name: row.campaign.name,
        status: row.campaign.status,
      }));
  
      res.json({ campaigns });
    } catch (err) {
      console.error('Error fetching campaigns:', err.message, err);
      res.status(500).json({ error: 'Failed to fetch campaigns', details: err.message });
    }
  });
  

app.post('/sync-locations', async (req, res) => {
  try {
    const { locations } = req.body;
    const { dry_run } = req.query;

    if (!locations || !Array.isArray(locations)) {
      return res.status(400).json({ error: 'Invalid locations array.' });
    }

    const result = await syncLocationHandler(locations, dry_run === 'true');
    res.json(result);
  } catch (err) {
    console.error('Error syncing locations:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`);
});
