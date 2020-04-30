import { RequestHandler } from 'express'; // eslint-disable-line
import { captureException } from '../helpers/logger';
import getNavigationBarItems from '../helpers/navigationBarItems';

import repositoryModel from '../models/repository';

const navigationBarItems = getNavigationBarItems('project');

const projects: RequestHandler = async (_request, response) => {
	let repositories;
	try {
		repositories = await repositoryModel.read();
	} catch (error) {
		captureException(error);
		response.setHeader('Cache-Control', 'no-store');
		response.statusCode = 500;
		return response.render('fullScreenMessage', {
			pageTitle: 'Something went wrong my end',
			navigationBarItems,
			heroType: 'is-danger',
			message: 'I\'ve been notified and will fix this soon',
		});
	}

	response.setHeader('Cache-Control', 'public, no-cache, proxy-revalidate');

	if (!repositories || !repositories.length) {
		response.statusCode = 404;
		return response.render('projects', {
			pageTitle: 'No projects found',
			navigationBarItems,
			projects: [],
		});
	}

	return response.render('projects', {
		pageTitle: 'Projects',
		navigationBarItems,
		projects: repositories.map((repository) => {
			const humanDate = repository.updatedAt.toDateString();
			return { ...repository, updatedAt: humanDate };
		}),
	});
};

export default projects;
