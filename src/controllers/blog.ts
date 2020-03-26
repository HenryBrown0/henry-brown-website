import { Request, Response } from 'express';

const blog = (_: Request, res: Response) => {
	res.render('blog', {
		pageTitle: 'Blog',
		posts: [],
		year: new Date().getFullYear(),
	});
};

export default blog;
