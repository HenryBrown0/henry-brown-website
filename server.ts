import express = require('express');

const app: express.Application = express();

app.get('/', ((request: express.request, response: express.request) => {
	response.send('Hello world')
}));

app.listen(3000, (() => {
	console.info('\x1b[33m%s\x1b[0m', 'Listening on port 3000');
}));
