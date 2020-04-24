const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const { NODE_ENV, DATABASE_URL } = process.env;

let poolConfig = {
	connectionString: DATABASE_URL,
};

if (NODE_ENV !== 'development') {
	poolConfig = {
		...poolConfig,
		ssl: { rejectUnauthorized: false },
	};
}

const pool = new Pool(poolConfig);

const schemaPath = path.join(__dirname, 'schema.sql');

const runQuery = (statements) => {
	if (!statements.length) return [];

	const [currentStatement, ...nextStatements] = statements;

	return pool.query(currentStatement)
		.then(() => {
			console.info('✅ ', currentStatement);
			return runQuery(nextStatements);
		})
		.catch((queryError) => {
			console.error('❌ ', currentStatement, queryError);
			throw queryError;
		});
};

const fileToArray = (fileBuffer) => (
	fileBuffer
		.toString('utf8')
		.replace(/[\n\t]/gi, '')
		.split(';')
		.filter((statement) => !!statement)
);

fs.readFile(schemaPath, (fileError, fileBuffer) => {
	if (fileError) throw fileError;
	const statements = fileToArray(fileBuffer);

	runQuery(statements)
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
});
