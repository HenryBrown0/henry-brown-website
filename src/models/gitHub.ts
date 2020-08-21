import { Severity } from '@sentry/node';
import tinyColor from 'tinycolor2';
import { captureMessage, captureException } from '../helpers/logger';
import getGraphQLClient from '../helpers/github';
import transformUriToName from '../helpers/transformUriToName';

const GIT_HUB_LOGIN = 'HenryBrown0';
const REPOSITORY_LIMIT = 20;

interface IRawGitHubRepository {
	name: string,
	description: string;
	updatedAt: string;
	isArchived: boolean,
	primaryLanguage: {
		color: string;
	};
	url: string;
}

const transformGitHubRepository = (repository: IRawGitHubRepository): IRepository => {
	const backgroundColor = repository.primaryLanguage.color;
	return {
		id: repository.name,
		name: transformUriToName(repository.name),
		description: repository.description,
		updatedAt: new Date(repository.updatedAt),
		isArchived: repository.isArchived,
		backgroundColor: backgroundColor.split('#')[1],
		isBackgroundDark: tinyColor(backgroundColor).isDark(),
		gitHubUrl: repository.url,
		images: [],
	};
};

const gitHubRepositoriesQuery = `
	query getRepositories($login: String!, $limit: Int!) {
		user(login: $login) {
			repositories(
				first: $limit
				ownerAffiliations: OWNER
				privacy: PUBLIC
				orderBy: {
					field: UPDATED_AT
					direction: DESC
				}
			) {
				edges {
					node {
						name
						description
						updatedAt
						isArchived
						primaryLanguage {
							color
						}
						url
					}
				}
			}
		}
	}
`;

const gitHubRepositoryQuery = `
	query getRepository($login: String!, $name: String!) {
		user(login: $login) {
			repository(name: $name) {
				name
				description
				updatedAt
				isArchived
				primaryLanguage {
					color
				}
				url
				isPrivate
			}
		}
	}
`;

const create = (): void => {
	captureMessage('Not yet implemented', Severity.Debug);
};

const read = async (name?: string): Promise<IRepository[]> => {
	const graphQLClient = getGraphQLClient();

	if (name) {
		try {
			const gitHubRepository = await graphQLClient.request(
				gitHubRepositoryQuery,
				{
					login: GIT_HUB_LOGIN,
					name,
				},
			);

			if (!gitHubRepository
				|| !gitHubRepository.user.repository
				|| gitHubRepository.user.repository.isPrivate
			) {
				return [];
			}

			return [transformGitHubRepository(gitHubRepository.user.repository)];
		} catch (error) {
			captureException(error);
			return [];
		}
	}

	try {
		const gitHubRepositories = await graphQLClient.request(
			gitHubRepositoriesQuery,
			{
				login: GIT_HUB_LOGIN,
				limit: REPOSITORY_LIMIT,
			},
		);
		if (!gitHubRepositories) return [];
		return gitHubRepositories.user.repositories.edges.map((rawRepositoryEdge: any) => (
			transformGitHubRepository(rawRepositoryEdge.node)
		));
	} catch (error) {
		captureException(error);
		return [];
	}
};

const update = (): void => {
	captureMessage('Not yet implemented', Severity.Debug);
};

const remove = (): void => {
	captureMessage('Not yet implemented', Severity.Debug);
};

export default {
	create,
	read,
	update,
	remove,
};
