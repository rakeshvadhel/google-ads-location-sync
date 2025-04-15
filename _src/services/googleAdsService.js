// src/services/googleAdsService.js
require('dotenv').config();
const { GoogleAdsApi } = require('google-ads-api');

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  developer_token: process.env.DEVELOPER_TOKEN,
});

const customer = client.Customer({
  customer_id: process.env.CUSTOMER_ID,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

async function getCustomerInfo() {
    // return customer;

    const campaigns = await customer.report({
        entity: "campaign",
        attributes: [
          "campaign.id",
          "campaign.name",
          "campaign.bidding_strategy_type",
          "campaign_budget.amount_micros",
        ],
        metrics: [
          "metrics.cost_micros",
          "metrics.clicks",
          "metrics.impressions",
          "metrics.all_conversions",
        ],
        // constraints: {
        //   "campaign.status": enums.CampaignStatus.ENABLED,
        // },
        limit: 20,
      });

    // const campaigns = await customer.query(`
    //     SELECT 
    //       campaign.id, 
    //       campaign.name,
    //       campaign.bidding_strategy_type,
    //       campaign_budget.amount_micros,
    //       metrics.cost_micros,
    //       metrics.clicks,
    //       metrics.impressions,
    //       metrics.all_conversions
    //     FROM 
    //       campaign
    //     WHERE
    //       campaign.status = "ENABLED"
    //     LIMIT 20
    //   `);

    //   return campaigns

//   const info = await customer.query(`
//     SELECT customer.id, customer.descriptive_name, customer.currency_code, customer.time_zone
//     FROM customer
//     LIMIT 1
//   `);
  return campaigns;
  return info[0];
}

async function getActiveCampaigns() {
  const campaigns = await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status
    FROM campaign
    WHERE campaign.status = 'ENABLED'
    ORDER BY campaign.id
  `);
  return campaigns;
}

module.exports = {
  getCustomerInfo,
  getActiveCampaigns,
};
