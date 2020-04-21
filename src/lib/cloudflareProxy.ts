import { RequestHandler } from 'express'; // eslint-disable-line
import { RequestOptions } from 'http'; // eslint-disable-line
import IPCIDR from 'ip-cidr';
import lastInArray from './lastInArray';
import httpRequest from './httpRequest';

const { NODE_ENV } = process.env;
const hostname = NODE_ENV === 'production' ? 'https://henrybrown0.com' : 'https://staging.henrybrown0.com';

const requestOptions: RequestOptions = {
	hostname: 'www.cloudflare.com',
	path: '/ips-v4',
	method: 'GET',
	headers: { 'Accept-Language': 'text/plain' },
};

const cloudflareCIDRs: IPCIDR[] = [];
if (NODE_ENV === 'production' || NODE_ENV === 'staging') {
	httpRequest(requestOptions, null)
		.then((rawCIDRs: string) => {
			const CIDRs = rawCIDRs
				.split('\n')
				.map((rawCIDR) => new IPCIDR(rawCIDR))
				.filter((CIDR) => CIDR.isValid());

			cloudflareCIDRs.push(...CIDRs);
		});
}

const cloudflareProxy: RequestHandler = (request, response, next) => {
	const requestingIp = lastInArray(request.ips);

	console.log('request.ips', request.ips);
	console.log('request.ip', request.ip);
	console.log('cloudflareCIDRs', cloudflareCIDRs);

	for (let index = 0; index < cloudflareCIDRs.length; index += 1) {
		const CIDR = cloudflareCIDRs[index];

		if (CIDR.contains(requestingIp)) return next();
	}

	// return response.redirect(hostname + request.path);
	console.log('redirect');
	return next();
};

export default cloudflareProxy;
