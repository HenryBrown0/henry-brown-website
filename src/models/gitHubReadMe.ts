import https from 'https';
import renderHTML from '../helpers/markdownToHTML';

const getReadMe = async (name: string): Promise<string> => {
	if (!name) {
		throw new Error('No repository name provided');
	}

	const uri = `https://raw.githubusercontent.com/HenryBrown0/${name}/master/README.md`;

	return new Promise((resolve, reject) => {
		https.get(uri, (response) => {
			if (response.statusCode !== 200) {
				response.resume();
				reject(new Error('Non 200 status code from read me'));
			}

			if (!/^text\/plain/.test(response.headers['content-type'])) {
				response.resume();
				reject(new Error('Incorrect file formate from read me'));
			}

			response.setEncoding('utf8');

			let rawData = '';
			response.on('data', (chunk) => {
				rawData += chunk;
			});
			response.on('end', () => resolve(renderHTML(rawData)));
		}).on('error', (error) => {
			reject(error);
		});
	});
};

export default getReadMe;
