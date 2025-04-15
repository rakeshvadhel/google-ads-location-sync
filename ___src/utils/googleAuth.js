const { google } = require('googleapis');

const getAccessToken = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const { token } = await oauth2Client.getAccessToken();
  return token;
};

module.exports = {
  getAccessToken,
};
