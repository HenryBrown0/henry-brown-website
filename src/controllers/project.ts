import { Request, Response } from 'express'; // eslint-disable-line
import getGitHubReadMe from '../models/gitHubReadMe';
import getGithubRepository from '../models/gitHubRepository';

const project = async (request: Request, response: Response) => {
	const { projectName } = request.params;

	response.setHeader('Cache-Control', 'max-age=300');
	response.setHeader('Cache-Control', 's-maxage=900');

	let repository;
	try {
		repository = await getGithubRepository(projectName);
	} catch (error) {
		console.error(error);
		response.statusCode = 500;
		response.end();
		return;
	}

	if (!repository) {
		console.warn('Empty GitHub GraphQL response');
		response.statusCode = 500;
		response.end();
		return;
	}

	if (repository.isPrivate) {
		response.statusCode = 404;
		response.end();
		return;
	}

	let readMe: string;
	try {
		readMe = await getGitHubReadMe(repository.uri);
	} catch (error) {
		console.error(error);
		response.statusCode = 500;
		response.end();
		return;
	}

	if (!readMe) {
		console.warn('Empty GitHub read me response');
		response.statusCode = 500;
		response.end();
		return;
	}

	response.render('project', {
		backgroundColor: repository.backgroundColor,
		description: repository.description,
		githubUrl: repository.githubUrl,
		isBackgroundDark: repository.isBackgroundDark,
		name: repository.name,
		project: readMe,
		year: new Date().getFullYear(),
	});
};

export default project;
