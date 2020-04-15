import { RequestHandler } from 'express'; // eslint-disable-line
import databaseQuery from '../lib/database';
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';

const navigationBarItems: INavigationBarItem[] = [
	{
		name: 'Blog',
		href: 'blog',
		isActive: false,
	}, {
		name: 'Projects',
		href: 'project',
		isActive: false,
	}, {
		name: 'Services',
		href: 'service',
		isActive: false,
	}, {
		name: 'Contact',
		href: 'contact',
		isActive: false,
	},
];

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
			danger: true,
			nonce: uuidv4(),
			navigationBarItems,
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
		console.error(error);
		return response.render('fullScreenMessage', {
			heroType: 'is-danger',
			pageTitle: 'Something went wrong my end',
			message: 'I\'ve been notified and will fix this soon',
			navigationBarItems,
		});
	}

	if (alreadyExist) {
		return response.render('contact', {
			pageTitle: 'Contact me',
			description: null,
			navigationBarItems,
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
		console.error(error);
		return response.render('fullScreenMessage', {
			heroType: 'is-danger',
			pageTitle: 'Something went wrong my end',
			message: 'I\'ve been notified and will fix this soon',
			navigationBarItems,
		});
	}

	// TODO: send an email notification to myself

	return response.render('fullScreenMessage', {
		heroType: 'is-success',
		pageTitle: 'Message received',
		message: 'I\'ll get back to you shortly',
		navigationBarItems,
	});
};

export default handleContactSubmit;
