const { GoogleAdsApi } = require('google-ads-api');
const { getAccessToken } = require('../utils/googleAuth');

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  developer_token: process.env.DEVELOPER_TOKEN,
});

const syncLocationHandler = async (locations, dryRun = false) => {
  const accessToken = await getAccessToken();
  const customerId = 'your-test-account-id'; // or from env

  const customer = client.Customer({
    customer_id: customerId,
    access_token: accessToken,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN, // required by sdk
    login_customer_id: process.env.LOGIN_CUSTOMER_ID || undefined,
  });

  // TODO: Fetch geo_target_constants, campaigns, and sync targeting.

  return {
    message: 'Dry run - would sync locations',
    locations,
    dryRun,
  };
};

module.exports = {
  syncLocationHandler,
};
