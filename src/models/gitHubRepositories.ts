import getGraphQLClient from '../helpers/github';
import transformUriToName from '../helpers/transformUriToName';

interface IRawGitHubRepository {
	node: {
		name: string,
		openGraphImageUrl: string,
		stargazers: {
			totalCount: number,
		},
		pullRequests: {
			totalCount: number,
		},
		issues: {
			totalCount: number,
		},
		updatedAt: string,
		isArchived: boolean,
		licenseInfo: {
			name: string,
		},
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
	image: string;
	isArchived: boolean;
	issues: number;
	license: string;
	link: string;
	name: string;
	pullRequests: number;
	stars: number;
	updatedAt: string;
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
						stargazers {
							totalCount
						}
						pullRequests(states: OPEN) {
							totalCount
						}
						issues(states: OPEN) {
							totalCount
						}
						updatedAt
							openGraphImageUrl
							isArchived
							licenseInfo {
							name
						}
					}
				}
			}
		}
	}
`;

const transformGitHubRepositories = (repository: IRawGitHubRepository): IRepository => (
	{
		image: repository.node.openGraphImageUrl,
		isArchived: repository.node.isArchived,
		issues: repository.node.issues.totalCount,
		license: repository.node.licenseInfo.name,
		link: `/project/${repository.node.name}`,
		name: transformUriToName(repository.node.name),
		pullRequests: repository.node.pullRequests.totalCount,
		stars: repository.node.stargazers.totalCount,
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
