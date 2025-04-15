require('dotenv').config();
const { enums } = require("google-ads-api");
const { customer, client } = require('../config/googleAdsClient');

module.exports = {
    async customers (req, res) {
        try {
            const customers = await client.listAccessibleCustomers(refreshToken);
    
            return res.json({ customers });
        } catch (error) {
            console.error('Error fetching customers:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    async campaigns (req, res) {
        try {
            const campaigns = await customer.report({
                entity: "campaign",
                attributes: [
                    "campaign.id",
                    "campaign.name",
                    "campaign.bidding_strategy_type",
                    "campaign_budget.amount_micros"
                ],
                metrics: [
                    "metrics.cost_micros",
                    "metrics.clicks",
                    "metrics.impressions",
                    "metrics.all_conversions"
                ],
                constraints: {
                    "campaign.status": enums.CampaignStatus.ENABLED
                },
                limit: 20
            });
    
            return res.json({ campaigns });
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            return res.status(500).json({ error: error.message });
        }
    }
};