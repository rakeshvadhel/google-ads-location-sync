const express = require('express');
const app = express();
require('dotenv').config();
const routes = require('./routes');

app.use(routes);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
