import https from 'https';

const request = async (options: https.RequestOptions, body: string) => {
	const isJson = options.headers['Accept-Language'] === 'application/json';

	return new Promise((resolve) => {
		const httpRequest = https.request(options, (httpResponse) => {
			const { statusCode, headers } = httpResponse;
			const contentType = headers['content-type'];

			let error;
			if (statusCode !== 200) {
				error = `Request Failed.\n Status Code: ${statusCode}`;
			} else if (isJson && !/^application\/json/.test(contentType)) {
				error = `Invalid content-type.\n Expected application/json but received ${contentType}`;
			}
			if (error) {
				console.error(error);
				// Consume response data to free up memory
				httpResponse.resume();
				return resolve(null);
			}

			httpResponse.setEncoding('utf8');
			let rawData = '';
			httpResponse.on('data', (chunk) => { rawData += chunk; });
			return httpResponse.on('end', () => {
				if (!isJson) return resolve(rawData);

				let jsonData;
				try {
					jsonData = JSON.parse(rawData);
				} catch (parsingError) {
					console.error(parsingError.message);
					return resolve(null);
				}
				return resolve(jsonData);
			});
		});

		httpRequest.on('error', (httpError) => {
			console.error(`problem with request: ${httpError.message}`);
			return resolve(null);
		});

		// Write data to request body
		if (body) httpRequest.write(body);
		httpRequest.end();
	});
};

export default request;
