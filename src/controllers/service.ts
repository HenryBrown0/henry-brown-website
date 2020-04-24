import { RequestHandler } from 'express'; // eslint-disable-line
import { v4 as uuidv4 } from 'uuid';
import getNavigationBarItems from '../helpers/navigationBarItems';
import serviceModel from '../models/service';
import { captureException } from '../helpers/logger';

const navigationBarItems = getNavigationBarItems('service');

const service: RequestHandler = async (_request, response) => {
	let services;
	try {
		services = await serviceModel.read();
	} catch (error) {
		captureException(error);
		return response.sendStatus(500);
	}

	return response.render('service', {
		pageTitle: 'Services',
		description: null,
		navigationBarItems,
		services,
		nonce: uuidv4(),
		value: {},
		error: {},
	});
};

export default service;
