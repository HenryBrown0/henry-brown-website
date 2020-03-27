import https from 'https';
import renderHTML from '../helpers/markdownToHTML';

const getReadMe = async (name: string): Promise<string> => {
	if (!name) {
		console.warn('No repository name provided');
		return null;
	}

	const uri = `https://raw.githubusercontent.com/HenryBrown0/${name}/master/README.md`;

	return new Promise((resolve, reject) => {
		https.get(uri, (response) => {
			if (response.statusCode !== 200) {
				response.resume();
				console.warn('Non 200 status code from read me');
				return resolve(null);
			}

			if (!/^text\/plain/.test(response.headers['content-type'])) {
				response.resume();
				console.warn('Incorrect file formate from read me');
				return resolve(null);
			}

			response.setEncoding('utf8');

			let rawData = '';
			response.on('data', (chunk) => rawData += chunk);
			response.on('end', () => resolve(renderHTML(rawData)));
		}).on('error', (error) => {
			return reject(error);
		});
	});
};

export default getReadMe;
