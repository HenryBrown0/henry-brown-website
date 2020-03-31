import getGraphQLClient from '../helpers/github';
import transformUriToName from '../helpers/transformUriToName';

interface IRawGitHubRepository {
	node: {
		name: string,
		isArchived: boolean,
		primaryLanguage: {
			color: string;
		}
		description: string;
		updatedAt: string;
	};
}

interface IRawGitHubResponse {
	user: {
		repositories: {
			edges: IRawGitHubRepository[];
		};
	};
}

interface IRepository {
	isArchived: boolean;
	name: string;
	updatedAt: string;
	backgroundColor: string;
	description: string;
	link: string;
}

const githubRepositoriesQuery = `
	query getRepositories($limit: Int!) {
		user(login: "HenryBrown0") {
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
					}
				}
			}
		}
	}
`;

const transformGitHubRepositories = (repository: IRawGitHubRepository): IRepository => (
	{
		backgroundColor: repository.node.primaryLanguage.color,
		description: repository.node.description,
		isArchived: repository.node.isArchived,
		link: `/project/${repository.node.name}`,
		name: transformUriToName(repository.node.name),
		updatedAt: new Date(repository.node.updatedAt).toDateString(),
	}
);

const getGithubRepositories = async (limit: number): Promise<IRepository[]> => {
	const graphQLClient = getGraphQLClient();

	const githubRepositories: IRawGitHubResponse = await graphQLClient.request(
		githubRepositoriesQuery,
		{
			limit,
		},
	);

	if (!githubRepositories) {
		throw new Error('No data returned in GitHub GraphQL query for getting projects');
	}

	const transformedRepositories = githubRepositories
		.user.repositories.edges.map(transformGitHubRepositories);

	return transformedRepositories;
};

export default getGithubRepositories;
