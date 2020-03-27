import https from 'https';
import * as sentry from '@sentry/node';
import renderHTML from '../helpers/markdownToHTML';
import { addBreadcrumb, captureException, captureMessage } from '../helpers/logger';

const { Info, Warning } = sentry.Severity;

const getGitHubReadMe = async (name: string): Promise<string> => {
	addBreadcrumb(
		'getGitHubReadMe',
		'Getting read me from GitHub',
		{
			name,
		},
		Info,
	);

	if (!name) {
		captureMessage('No repository name provided', Warning);
		return null;
	}

	const uri = `https://raw.githubusercontent.com/HenryBrown0/${name}/master/README.md`;

	return new Promise((resolve) => {
		https.get(uri, (response) => { // eslint-disable-line
			if (response.statusCode === 404) {
				response.resume();
				return resolve(null);
			}

			if (response.statusCode !== 200) {
				response.resume();
				captureMessage(`${response.statusCode} status code from read me`, Warning);
				return resolve(null);
			}

			if (!/^text\/plain/.test(response.headers['content-type'])) {
				response.resume();
				captureMessage('Incorrect file formate from read me', Warning);
				return resolve(null);
			}

			response.setEncoding('utf8');

			let rawData = '';
			response.on('data', (chunk) => {
				rawData += chunk;
			});
			response.on('end', () => resolve(renderHTML(rawData)));
		}).on('error', (error) => {
			captureException(error);
			return resolve(null);
		});
	});
};

export default getGitHubReadMe;
