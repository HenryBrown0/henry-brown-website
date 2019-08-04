import express = require('express');
const PORT = process.env.PORT || 3000

const app: express.Application = express();

app.get('/', ((request, response) => {
	response.send('Hello world')
}));

app.listen(PORT, (() => {
	console.info('\x1b[33m%s\x1b[0m', `Listening on port ${PORT}`);
}));
