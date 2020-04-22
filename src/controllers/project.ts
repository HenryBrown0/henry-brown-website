import { Request, Response } from 'express'; // eslint-disable-line
import { Severity } from '@sentry/node';
import cache from '../helpers/cache';
import getGitHubReadMe from '../models/gitHubReadMe';
import getGithubRepository from '../models/gitHubRepository';
import { captureException, captureMessage } from '../helpers/logger';

interface IFullRepository {
	backgroundColor: string;
	description: string;
	gitHubUrl: string;
	isBackgroundDark: boolean;
	name: string;
	project: string;
	uri: string;
}

const project = async (request: Request, response: Response) => {
	const { projectName } = request.params;

	response.setHeader('Cache-Control', 'max-age=300');
	response.setHeader('Cache-Control', 's-maxage=900');

	const fullRepository: IFullRepository = cache.get(projectName);
	if (fullRepository) {
		response.render('project', {
			...fullRepository,
			year: new Date().getFullYear(),
		});
		return;
	}

	let repository;
	let readMe: string;
	try {
		[repository, readMe] = await Promise.all([
			getGithubRepository(projectName),
			getGitHubReadMe(projectName),
		]);
	} catch (error) {
		captureException(error);
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
		captureMessage('Private repository attempted to fetch', Severity.Warning);
		response.statusCode = 404;
		response.render('project', {
			year: new Date().getFullYear(),
		});
		return;
	}

	if (!readMe) {
		captureMessage('Empty GitHub read me response', Severity.Warning);
		response.statusCode = 404;
		response.render('project', {
			year: new Date().getFullYear(),
		});
		return;
	}

	cache.set(repository.uri, { ...repository, project: readMe }, 7200);

	response.render('project', {
		...repository,
		project: readMe,
		year: new Date().getFullYear(),
	});
};

export default project;
