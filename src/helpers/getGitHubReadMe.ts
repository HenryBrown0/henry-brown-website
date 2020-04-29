import { RequestOptions } from 'http'; // eslint-disable-line
import httpRequest from '../lib/httpRequest';
import renderHTML from './markdownToHTML';

const getGitHubReadMe = async (name: string): Promise<string> => {
	const requestOptions: RequestOptions = {
		hostname: 'raw.githubusercontent.com',
		path: `/HenryBrown0/${name}/master/README.md`,
		method: 'GET',
		headers: { 'Accept-Language': 'text/plain' },
	};

	const rawReadMe = await httpRequest(requestOptions, null);
	return renderHTML(String(rawReadMe));
};

export default getGitHubReadMe;
