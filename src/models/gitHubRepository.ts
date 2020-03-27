import tinyColor from 'tinycolor2';
import getGraphQLClient from '../helpers/github';
import transformUriToName from '../helpers/transformUriToName';

interface IRepository {
	uri: string;
	backgroundColor: string;
	description: string;
	gitHubUrl: string;
	isBackgroundDark: boolean;
	isPrivate: boolean;
	name: string;
}

interface IRawGitHubRepository {
	name: string;
	description: string;
	primaryLanguage: {
		color: string;
	};
	url: string;
	isPrivate: boolean;
}

const transformGithubRepository = (repository: IRawGitHubRepository): IRepository => {
	const backgroundColor = repository.primaryLanguage.color;
	return {
		backgroundColor,
		description: repository.description,
		githubUrl: repository.url,
		isBackgroundDark: tinyColor(backgroundColor).isDark(),
		isPrivate: repository.isPrivate,
		name: transformUriToName(repository.name),
		uri: repository.name,
	};
};

const githubRepositoryQuery: string = `
	query getRepository($name: String!) {
		repository(owner: "HenryBrown0", name: $name) {
			name
			description
			primaryLanguage {
				color
			}
			url
			isPrivate
		}
	}
`;

const getGithubRepository = async (name: string): Promise<IRepository> => {
	const graphQLClient = getGraphQLClient();

	const graphQLRequest = graphQLClient.request(
		githubRepositoryQuery,
		{
			name,
		},
	);

	let graphQLResponse;
	try {
		graphQLResponse = await graphQLRequest;
	} catch (error) {
		if (error && error.response && error.response.status === 200) {
			console.warn(error.response.errors);
			return null;
		}
		throw error;
	}

	if (!graphQLResponse || !graphQLResponse.repository) {
		console.warn('Empty GitHub GraphQL response');
		return null;
	}

	return transformGithubRepository(graphQLResponse.repository);
};

export default getGithubRepository;
