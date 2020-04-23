import { Request, Response } from 'express'; // eslint-disable-line
import cache from '../helpers/cache';
import getGithubRepositories from '../models/gitHubRepositories';
import { captureException } from '../helpers/logger';
import getNavigationBarItems from '../helpers/navigationBarItems';

const navigationBarItems = getNavigationBarItems('project');

const projects = async (_: Request, response: Response) => {
	response.setHeader('Cache-Control', 'max-age=300');
	response.setHeader('Cache-Control', 's-maxage=900');

	const fullRepositories: any[] = cache.get('projects');
	if (fullRepositories && fullRepositories.length) {
		return response.render('projects', {
			pageTitle: 'Projects',
			description: null,
			navigationBarItems,
			projects: fullRepositories,
		});
	}

	let githubRepositories;
	try {
		githubRepositories = await getGithubRepositories(20);
	} catch (error) {
		captureException(error);
		return response.sendStatus(500);
	}

	cache.set('projects', githubRepositories, 7200);

	return response.render('projects', {
		pageTitle: 'Projects',
		description: null,
		navigationBarItems,
		projects: githubRepositories,
	});
};

export default projects;
