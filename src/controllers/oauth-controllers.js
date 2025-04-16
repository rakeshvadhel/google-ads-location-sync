require('dotenv').config();
const express = require('express');
const app = express();
const { google } = require('googleapis');
const { enums } = require('google-ads-api');
const { customer, client } = require('../config/googleAdsClient');

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.REDIRECT_URI);
const SCOPES = ['https://www.googleapis.com/auth/adwords'];

module.exports = {
	async oauth(req, res) {
		const authUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
			prompt: 'consent',
		});

		return res.send(`
			<h2>Google Ads OAuth2</h2>
			<a href="${authUrl}">Click here to authorize access</a>
		`);
	},

	async oauth2callback(req, res) {
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
	},
};
