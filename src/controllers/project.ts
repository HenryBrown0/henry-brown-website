import { RequestHandler } from 'express'; // eslint-disable-line
import { captureException } from '../helpers/logger';
import getNavigationBarItems from '../helpers/navigationBarItems';
import repositoryModel from '../models/repository';

const navigationBarItems = getNavigationBarItems('project');

const project: RequestHandler = async (request, response) => {
	const { projectName } = request.params;

	let repository;
	try {
		repository = await repositoryModel.read(projectName);
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

	if (!repository || !repository.length) {
		response.statusCode = 404;
		return response.render('project', {
			pageTitle: 'Project not found',
			navigationBarItems,
		});
	}

	return response.render('project', {
		pageTitle: repository[0].name,
		description: repository[0].description,
		navigationBarItems,
		backgroundColor: repository[0].backgroundColor,
		gitHubUrl: repository[0].gitHubUrl,
		isBackgroundDark: repository[0].isBackgroundDark,
		readMe: repository[0].readMe,
		images: repository[0].images,
	});
};

export default project;
