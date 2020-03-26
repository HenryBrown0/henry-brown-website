import express from 'express';
import helmet from 'helmet';
import path from 'path';
import routes from './routes';
import setupPartials from './setupPartials';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'squirrelly');
app.set('views', 'views');

app.use(helmet());

app.use('/', routes);
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/', express.static(path.join(__dirname, '../public')));

const start = async () => {
	await setupPartials();
	app.listen(port);
};

start().then(() => {
	console.log(`Listening on port ${port}`);
}).catch((error) => {
	console.error(error);
});
