import { RequestHandler } from 'express'; // eslint-disable-line
import { v4 as uuidv4 } from 'uuid';
import getNavigationBarItems from '../helpers/navigationBarItems';

const navigationBarItems = getNavigationBarItems('contact');

const saveMessage: RequestHandler = (_request, response) => {
	response.setHeader('Cache-Control', 'public, no-cache, proxy-revalidate');

	return response.render('contact', {
		pageTitle: 'Contact me',
		description: null,
		navigationBarItems,
		nonce: uuidv4(),
		value: {},
		error: {},
	});
};

export default saveMessage;
