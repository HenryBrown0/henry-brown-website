import { RequestHandler } from 'express'; // eslint-disable-line
import { RequestOptions } from 'http'; // eslint-disable-line
import httpRequest from './httpRequest';

const { NODE_ENV = 'development' } = process.env;

const requestOptions: RequestOptions = {
	hostname: 'www.cloudflare.com',
	path: '/ips-v4',
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
		'Accept-Language': 'text/plain',
	},
};

const cloudflareIps: string[] = [];

if (NODE_ENV === 'production' || NODE_ENV === 'staging') {
	httpRequest(requestOptions, null)
		.then((rawIps: string) => {
			rawIps.split('\n').forEach((rawIp) => {
				const lastDotPosition = rawIp.lastIndexOf('.');

				const mainIp = rawIp.slice(0, lastDotPosition);
				const endIps = rawIp.slice(lastDotPosition + 1).split('/');

				cloudflareIps.push(...endIps.map((endIp) => `${mainIp}.${endIp}`));
			});
		});
}

const cloudflareProxy: RequestHandler = (request, response, next) => {
	const requestingIp = request.ips.pop();

	if (!cloudflareIps.includes(requestingIp)) {
		if (NODE_ENV === 'production') {
			return response.redirect(`https://henrybrown0.com${request.path}`);
		}
		return response.redirect(`https://staging.henrybrown0.com${request.path}`);
	}

	return next();
};

export default cloudflareProxy;
