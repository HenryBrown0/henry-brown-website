import { Pool, QueryResult } from 'pg'; // eslint-disable-line

const { DATABASE_URL } = process.env;

const pool = new Pool({
	host: DATABASE_URL || 'localhost',
});

const query = async (
	statement: string,
	variables?: Array<any>,
): Promise<QueryResult> => pool.query(statement, variables);

export default query;
