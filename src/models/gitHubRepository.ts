import tinyColor from 'tinycolor2';
import * as sentry from '@sentry/node';
import getGraphQLClient from '../helpers/github';
import transformUriToName from '../helpers/transformUriToName';
import { addBreadcrumb, captureException, captureMessage } from '../helpers/logger';

const { Info, Warning } = sentry.Severity;

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

interface IGitHubError {
	type: string;
	path: string[];
	locations: [
		{
			line: number,
			column: number
		}
	],
	message: string;
}

const transformGithubRepository = (repository: IRawGitHubRepository): IRepository => {
	addBreadcrumb(
		'transformGithubRepository',
		'Transforming GitHub repository',
		repository,
		Info,
	);

	const backgroundColor = repository.primaryLanguage.color;
	return {
		backgroundColor,
		description: repository.description,
		gitHubUrl: repository.url,
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
	addBreadcrumb(
		'getGithubRepository',
		'Getting repository from GitHub',
		{
			name,
		},
		Info,
	);

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
			const errorTypes: string[] = error.response.errors
				.map((githubError: IGitHubError) => githubError.type);

			if (errorTypes.includes('NOT_FOUND')) {
				return null;
			}
		}
		captureException(error);
		return null;
	}

	if (!graphQLResponse || !graphQLResponse.repository) {
		captureMessage('Empty GitHub GraphQL response', Warning);
		return null;
	}

	return transformGithubRepository(graphQLResponse.repository);
};

export default getGithubRepository;
