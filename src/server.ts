import express, { response } from 'express';
import helmet from 'helmet';
import path from 'path';
import * as sentry from '@sentry/node';
import routes from './routes';
import cronJob from './routes/cronJob';
import setupPartials from './setupPartials';
import { captureException } from './helpers/logger';
import cloudflareProxy from './lib/cloudflareProxy';

const { SENTRY_DSN, NODE_ENV = 'development', PORT } = process.env;

const app = express();

sentry.init({
	dsn: SENTRY_DSN,
	environment: NODE_ENV,
});

if (NODE_ENV === 'production' || NODE_ENV === 'staging') {
	app.set('trust proxy', true);
}
app.set('view engine', 'squirrelly');
app.set('views', 'views');

app.use(sentry.Handlers.requestHandler());
app.use(helmet());

if (NODE_ENV === 'production' || NODE_ENV === 'staging') {
	app.use(cloudflareProxy);
}
app.use('/', routes);
app.use('/cron-job', cronJob);
app.use('/static', express.static(path.join(__dirname, 'static'), {
	setHeaders: (staticResponse) => {
		staticResponse.setHeader('Cache-Control', 'public, max-age=86400');
	},
}));
app.use('/', express.static(path.join(__dirname, '../public'), {
	setHeaders: (staticResponse) => {
		staticResponse.setHeader('Cache-Control', 'public, max-age=604800');
	},
}));

app.use(sentry.Handlers.errorHandler());

const start = async () => {
	await setupPartials();
	app.listen(PORT || 3000);
};

start().then(() => {
	if (NODE_ENV === 'development') {
		console.info(`Listening on port ${PORT || 3000}`); // eslint-disable-line
	}
}).catch((error) => {
	captureException(error);
});
