const express = require('express');
const app = express();
require('dotenv').config();
import { GoogleAdsApi } from "google-ads-api";

const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

const client = new GoogleAdsApi({
	client_id: process.env.GOOGLE_CLIENT_ID,
	client_secret: process.env.GOOGLE_CLIENT_SECRET,
	developer_token: process.env.DEVELOPER_TOKEN
});

const customer = client.Customer({
	customer_id: process.env.CUSTOMER_ID,
	refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});


app.get('/customers', async (req, res) => {
	try {
		const customers = await client.listAccessibleCustomers(refreshToken);
	
		return res.json({ customers });
	} catch (error) {
		console.error('Error fetching customers:', error);
		return res.status(500).json({ error: error.message });
	}
});

app.listen(4444, () => {
	console.log('Server is running on port 4444');
});


















// // index.js
// require('dotenv').config();
// const app = require('./app');

// const PORT = process.env.PORT || 4444;
// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });
