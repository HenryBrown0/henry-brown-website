import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL

const newPool = () => {
	return new Pool({
		connectionString: DATABASE_URL,
		ssl: DATABASE_URL ? true : false
	})
}

const setup = async () => {
	const pool = newPool()

	const client = await pool.connect()
	try {
		await client.query('BEGIN')
		await client.query('CREATE TABLE IF NOT EXISTS blogPost ( id serial PRIMARY KEY, title VARCHAR (128) UNIQUE NOT NULL, url VARCHAR (128) UNIQUE NOT NULL );')
		await client.query('COMMIT')
	} catch (error) {
		await client.query('ROLLBACK')
		throw error
	} finally {
		client.release()
		console.log('DB setup complete')
	}
}

const run = async (statement: string, params: []) => {
	const pool = newPool()

	const dbResponse = await pool.query(statement, params)
	await pool.end()

	return dbResponse.rows
}

export default { setup, run };
