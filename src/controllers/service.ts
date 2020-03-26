import { Request, Response } from 'express';

const service = (_: Request, res: Response) => {
	res.render('Service', {
		pageTitle: 'Services',
		year: new Date().getFullYear(),
	});
};

export default service;
