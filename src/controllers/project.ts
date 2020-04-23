import { Request, Response } from 'express'; // eslint-disable-line
import { Severity } from '@sentry/node';
import cache from '../helpers/cache';
import getGitHubReadMe from '../models/gitHubReadMe';
import getGithubRepository from '../models/gitHubRepository';
import { captureException, captureMessage } from '../helpers/logger';
import getNavigationBarItems from '../helpers/navigationBarItems';

interface IFullRepository {
	backgroundColor: string;
	description: string;
	gitHubUrl: string;
	isBackgroundDark: boolean;
	name: string;
	project: string;
	uri: string;
}

const navigationBarItems = getNavigationBarItems('project');

const projectNotFound: {
	pageTitle: string,
	description: string,
	navigationBarItems: {}[],
	backgroundColor: string,
	gitHubUrl: string,
	isBackgroundDark: string,
	uri: string,
	project: string,
} = {
	pageTitle: 'Project not found',
	description: null,
	navigationBarItems,
	backgroundColor: null,
	gitHubUrl: null,
	isBackgroundDark: null,
	uri: null,
	project: null,
};

const project = async (request: Request, response: Response) => {
	const { projectName } = request.params;

	response.setHeader('Cache-Control', 'max-age=300');
	response.setHeader('Cache-Control', 's-maxage=900');

	const fullRepository: IFullRepository = cache.get(projectName);
	if (fullRepository) {
		return response.render('project', {
			pageTitle: fullRepository.name,
			description: fullRepository.description,
			navigationBarItems,
			backgroundColor: fullRepository.backgroundColor,
			gitHubUrl: fullRepository.gitHubUrl,
			isBackgroundDark: fullRepository.isBackgroundDark,
			uri: fullRepository.uri,
			project: fullRepository.project,
		});
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
		return response.sendStatus(500);
	}

	if (!repository) {
		response.statusCode = 404;
		return response.render('project', projectNotFound);
	}

	if (repository.isPrivate) {
		captureMessage('Private repository attempted to fetch', Severity.Warning);
		response.statusCode = 404;
		return response.render('project', projectNotFound);
	}

	if (!readMe) {
		captureMessage('Empty GitHub read me response', Severity.Warning);
		response.statusCode = 404;
		return response.render('project', projectNotFound);
	}

	cache.set(repository.uri, { ...repository, project: readMe }, 7200);

	return response.render('project', {
		pageTitle: repository.name,
		description: repository.description,
		navigationBarItems,
		backgroundColor: repository.backgroundColor,
		gitHubUrl: repository.gitHubUrl,
		isBackgroundDark: repository.isBackgroundDark,
		uri: repository.uri,
		project: readMe,
	});
};

export default project;
