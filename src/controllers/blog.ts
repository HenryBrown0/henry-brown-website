import { Request, Response } from 'express'; // eslint-disable-line

const blog = (_: Request, res: Response) => {
	res.render('blog', {
		pageTitle: 'Blog',
		posts: [],
		year: new Date().getFullYear(),
	});
};

export default blog;
