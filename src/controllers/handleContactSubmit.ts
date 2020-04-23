import { RequestHandler } from 'express'; // eslint-disable-line
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import databaseQuery from '../lib/database';
import { captureException } from '../helpers/logger';
import getNavigationBarItems from '../helpers/navigationBarItems';

const defaultNavigation = getNavigationBarItems(null);
const contactNavigation = getNavigationBarItems('contact');

const handleContactSubmit: RequestHandler = async (request, response) => {
	const validationErrors = validationResult(request);

	if (!validationErrors.isEmpty()) {
		const errors: any = {};
		request.body.phoneNumber = request.body.phoneNumber.substr(1);

		validationErrors.array().forEach((error) => {
			const key = error.param;

			if (!errors[key]) {
				errors[key] = [error.msg];
			} else {
				errors[key].push(error.msg);
			}
		});

		return response.render('contact', {
			pageTitle: 'Contact',
			description: 'Validation errors',
			navigationBarItems: contactNavigation,
			danger: true,
			nonce: uuidv4(),
			error: errors,
			value: request.body,
		});
	}

	const {
		nonce,
		name,
		email,
		phoneNumber = null,
		webDevelopment,
		webHosting,
		message,
	} = request.body;

	let alreadyExist = true;
	try {
		const queryResult = await databaseQuery(
			'SELECT nonce FROM user_query WHERE nonce = $1',
			[nonce],
		);
		alreadyExist = Boolean(queryResult.rows.length);
	} catch (error) {
		captureException(error);
		return response.render('fullScreenMessage', {
			pageTitle: 'Something went wrong my end',
			navigationBarItems: defaultNavigation,
			heroType: 'is-danger',
			message: 'I\'ve been notified and will fix this soon',
		});
	}

	if (alreadyExist) {
		return response.render('contact', {
			pageTitle: 'Contact me',
			description: null,
			navigationBarItems: contactNavigation,
			nonce: uuidv4(),
			value: {},
			error: {},
		});
	}

	try {
		await databaseQuery(
			'INSERT INTO user_query(id, nonce, name, email, phone_number, web_development, web_hosting, message) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
			[
				uuidv4(),
				nonce,
				name,
				email,
				phoneNumber,
				Boolean(webDevelopment),
				Boolean(webHosting),
				message,
			],
		);
	} catch (error) {
		captureException(error);
		return response.render('fullScreenMessage', {
			pageTitle: 'Something went wrong my end',
			navigationBarItems: defaultNavigation,
			heroType: 'is-danger',
			message: 'I\'ve been notified and will fix this soon',
		});
	}

	// TODO: send an email notification to myself

	return response.render('fullScreenMessage', {
		pageTitle: 'Message received',
		navigationBarItems: defaultNavigation,
		heroType: 'is-success',
		message: 'I\'ll get back to you shortly',
	});
};

export default handleContactSubmit;
