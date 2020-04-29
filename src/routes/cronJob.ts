import express, { RequestHandler } from 'express'; // eslint-disable-line
import updateRepositories from '../controllers/cronJob/updateRepositories';

const { CRON_JOB_KEY } = process.env;

const router = express.Router();

const checkCronJobKeyHeader: RequestHandler = (request, response, next) => {
	if (request.headers.authorization !== CRON_JOB_KEY) {
		return response.sendStatus(403);
	}

	return next();
};

router.get('/update-repositories', checkCronJobKeyHeader, updateRepositories);

export default router;
