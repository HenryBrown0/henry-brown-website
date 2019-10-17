import express = require('express');
import db from './db';

const PORT = process.env.PORT || 3000
const app: express.Application = express();

app.get('/', (async (_, response) => {
	let rows;
	try {
		rows = await db.run('SELECT * FROM blogPost;', [])
	} catch (error) {
		console.log(error)
		response.status(500).end()
	}
	response.send(rows)
}));

app.use(express.static('build/public/'))

db.setup().then(() => {
	app.listen(PORT, (() => {
		console.info('\x1b[33m%s\x1b[0m', `Listening on port ${PORT}`);
	}));
}).catch(error => console.error(error))

