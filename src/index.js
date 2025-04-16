const express = require('express');
const app = express();
require('dotenv').config();
const routes = require('./routes');
const oauthRoutes = require('./routes/oauth-routes');

app.use(routes);
app.use(oauthRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
