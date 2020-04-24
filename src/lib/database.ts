import { Pool, QueryResult, PoolConfig } from 'pg'; // eslint-disable-line

const { NODE_ENV, DATABASE_URL } = process.env;

let poolConfig: PoolConfig = {
	connectionString: DATABASE_URL,
};

if (NODE_ENV !== 'development') {
	poolConfig = {
		...poolConfig,
		ssl: { rejectUnauthorized: false },
	};
}

const pool = new Pool(poolConfig);

const query = async (
	statement: string,
	variables?: Array<any>,
): Promise<QueryResult> => pool.query(statement, variables);

export default query;
