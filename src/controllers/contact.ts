import { RequestHandler } from 'express'; // eslint-disable-line
import { v4 as uuidv4 } from 'uuid';

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
		href: 'services',
		isActive: false,
	},
	{
		name: 'Contact me',
		href: 'contact',
		isActive: true,
	},
];

const saveMessage: RequestHandler = (request, response) => {
	response.render('contact', {
		pageTitle: 'Contact me',
		description: null,
		navigationBarItems,
		nonce: uuidv4(),
		value: {},
		error: {},
	});
};

export default saveMessage;
