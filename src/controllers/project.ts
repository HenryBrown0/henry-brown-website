import { Request, Response } from 'express';
import NodeCache from 'node-cache';
import getGitHubReadMe from '../models/gitHubReadMe';
import getGithubRepository from '../models/gitHubRepository';

interface IFullRepository {
	backgroundColor: string;
	description: string;
	gitHubUrl: string;
	isBackgroundDark: boolean;
	name: string;
	project: string;
}

const repositoryCache = new NodeCache();

const project = async (request: Request, response: Response) => {
	const { projectName } = request.params;

	let fullRepository: IFullRepository = repositoryCache.get(projectName);

	if (fullRepository) {
		response.render('project', {
			...fullRepository,
			year: new Date().getFullYear(),
		});
		return;
	}

	response.setHeader('Cache-Control', 'max-age=300');
	response.setHeader('Cache-Control', 's-maxage=900');

	let repository;
	let readMe: string;
	try {
		[repository, readMe] = await Promise.all([
			getGithubRepository(projectName),
			getGitHubReadMe(projectName),
		]);
	} catch (error) {
		console.error(error);
		response.statusCode = 500;
		response.end();
		return;
	}

	if (!repository) {
		response.statusCode = 404;
		response.render('project', {
			year: new Date().getFullYear(),
		});
		return;
	}

	if (repository.isPrivate) {
		console.warn('Private repository attempted to fetch');
		response.statusCode = 404;
		response.render('project', {
			year: new Date().getFullYear(),
		});
		return;
	}

	if (!readMe) {
		console.warn('Empty GitHub read me response');
		response.statusCode = 404;
		response.render('project', {
			year: new Date().getFullYear(),
		});
		return;
	}

	fullRepository = {
		backgroundColor: repository.backgroundColor,
		description: repository.description,
		gitHubUrl: repository.gitHubUrl,
		isBackgroundDark: repository.isBackgroundDark,
		name: repository.name,
		project: readMe,
	};

	repositoryCache.set(projectName, fullRepository, 600);

	response.render('project', {
		...fullRepository,
		year: new Date().getFullYear(),
	});
};

export default project;
