import express from 'express';
import helmet from 'helmet';
import path from 'path';
import * as sentry from '@sentry/node';
import routes from './routes';
import setupPartials from './setupPartials';
import { captureException } from './helpers/logger';

const { SENTRY_DSN, NODE_ENV, PORT } = process.env;

const app = express();

sentry.init({
	dsn: SENTRY_DSN,
	environment: NODE_ENV || 'development',
});

app.set('view engine', 'squirrelly');
app.set('views', 'views');

app.use(sentry.Handlers.requestHandler());
app.use(helmet());

app.use('/', routes);
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/', express.static(path.join(__dirname, '../public')));

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
