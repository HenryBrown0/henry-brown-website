import express = require('express');
import { Client } from 'pg';
const PORT = process.env.PORT || 3000
const DATABASE_URL = process.env.DATABASE_URL

const app: express.Application = express();

const getData = async () => {
	const client = new Client({
		connectionString: DATABASE_URL,
		ssl: DATABASE_URL ? true : false,
	});

	await client.connect();

	const response = await client.query('SELECT * FROM blogPost;')

	await client.end();
	
	return response.rows
}

app.get('/', (async (request, response) => {
	let rows;
	try {
		rows = await getData()
	} catch (error) {
		response.status(500).end()
	}
	response.send(rows)
}));

app.use(express.static('build/public/'))

app.listen(PORT, (() => {
	console.info('\x1b[33m%s\x1b[0m', `Listening on port ${PORT}`);
}));
