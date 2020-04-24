import { RequestHandler } from 'express'; // eslint-disable-line
import getNavigationBarItems from '../helpers/navigationBarItems';

const navigationBarItems = getNavigationBarItems('blog');

const blog: RequestHandler = (_request, response) => (
	response.render('blog', {
		pageTitle: 'Blog',
		description: null,
		navigationBarItems,
		posts: [],
	})
);

export default blog;
