import { Request, Response } from 'express';

const service = (_: Request, res: Response) => {
	res.render('service', {
		pageTitle: 'Services',
		year: new Date().getFullYear(),
	});
};

export default service;
