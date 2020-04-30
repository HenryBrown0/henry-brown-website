import { RequestHandler } from 'express'; // eslint-disable-line

const index: RequestHandler = (_request, response) => {
	response.setHeader('Cache-Control', 'public, no-cache, proxy-revalidate');

	return response.render('index', {
		pageTitle: 'Home',
		description: 'Third year computer science student at the University of Kent',
	});
};

export default index;
