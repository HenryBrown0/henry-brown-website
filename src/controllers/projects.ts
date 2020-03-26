import { Request, Response } from 'express';
import getGithubRepositories from '../models/gitHubRepositories';

const projects = async (_: Request, response: Response) => {
	response.setHeader('Cache-Control', 'max-age=300');
	response.setHeader('Cache-Control', 's-maxage=900');

	let githubRepositories;
	try {
		githubRepositories = await getGithubRepositories(20);
	} catch (error) {
		console.error(error);
		response.statusCode = 500;
		response.end();
		return;
	}

	response.render('projects', {
		description: '',
		pageTitle: 'Projects',
		projects: githubRepositories,
		year: new Date().getFullYear(),
	});
};

export default projects;
