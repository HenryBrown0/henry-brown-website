import { Request, Response } from 'express'; // eslint-disable-line
import cache from '../helpers/cache';
import getGithubRepositories from '../models/gitHubRepositories';

const projects = async (_: Request, response: Response) => {
	response.setHeader('Cache-Control', 'max-age=300');
	response.setHeader('Cache-Control', 's-maxage=900');

	const fullRepositories: any[] = cache.get('projects');
	if (fullRepositories && fullRepositories.length) {
		response.render('projects', {
			description: '',
			pageTitle: 'Projects',
			projects: fullRepositories,
			year: new Date().getFullYear(),
		});
		return;
	}

	let githubRepositories;
	try {
		githubRepositories = await getGithubRepositories(20);
	} catch (error) {
		console.error(error);
		response.statusCode = 500;
		response.end();
		return;
	}

	cache.set('projects', githubRepositories, 7200);

	response.render('projects', {
		description: '',
		pageTitle: 'Projects',
		projects: githubRepositories,
		year: new Date().getFullYear(),
	});
};

export default projects;
