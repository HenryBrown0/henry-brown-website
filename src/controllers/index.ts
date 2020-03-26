import { Request, Response } from 'express';

const index = (_: Request, res: Response) => {
	res.render('index', {
		description: 'Third year computer science student at the University of Kent',
		pageTitle: 'Home',
		year: new Date().getFullYear(),
	});
};

export default index;
