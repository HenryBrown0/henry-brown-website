import { GraphQLClient } from 'graphql-request';

const { GITHUB_KEY } = process.env;
const GITHUB_ENDPOINT = 'https://api.github.com/graphql';

const client = new GraphQLClient(GITHUB_ENDPOINT, {
	headers: {
		authorization: `Bearer ${GITHUB_KEY}`,
	},
});

const getGraphQLClient = (): GraphQLClient => client;

export default getGraphQLClient;
