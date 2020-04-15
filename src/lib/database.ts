import { Pool, QueryResult } from 'pg'; // eslint-disable-line

const { DATABASE_URL } = process.env;

const pool = new Pool({
	connectionString: DATABASE_URL,
	ssl: Boolean(DATABASE_URL),
});

const query = async (
	statement: string,
	variables?: Array<any>,
): Promise<QueryResult> => pool.query(statement, variables);

export default query;
