const { GoogleAdsApi } = require("google-ads-api");
require('dotenv').config();

const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    developer_token: process.env.DEVELOPER_TOKEN
});

const customer = client.Customer({
    customer_id: process.env.CUSTOMER_ID,
    refresh_token: refreshToken
});


module.exports = {
    client,
    customer,
    refreshToken
};