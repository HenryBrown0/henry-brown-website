const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const { DATABASE_URL } = process.env;

const pool = new Pool({
	connectionString: DATABASE_URL,
	ssl: Boolean(DATABASE_URL),
});
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
