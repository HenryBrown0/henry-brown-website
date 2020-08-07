import { Pool, QueryResult, PoolConfig } from 'pg'; // eslint-disable-line

const { DATABASE_URL, DATABASE_NO_SSL, DATABASE_SSL_ACCEPT_UNAUTHORIZED } = process.env;

const sslConnectionOptions = {
	rejectUnauthorized: Number(DATABASE_SSL_ACCEPT_UNAUTHORIZED) === 0,
};

const poolConfig: PoolConfig = {
	connectionString: DATABASE_URL,
	ssl: Number(DATABASE_NO_SSL) === 1 ? false : sslConnectionOptions,
};

const pool = new Pool(poolConfig);

const query = async (
	statement: string,
	variables?: Array<string|number|boolean|Date>,
): Promise<QueryResult> => pool.query(statement, variables);

export default query;
