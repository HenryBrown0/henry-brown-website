
import * as sentry from '@sentry/node';

const { NODE_ENV } = process.env;

const sendToSentry: { [key: string]: boolean } = {
	review: true,
	staging: true,
	production: true,
};

const captureMessage = (message: string, severity: sentry.Severity): void => {
	if (sendToSentry[NODE_ENV]) {
		sentry.captureMessage(message, severity);
	} else {
		console.log(message); // eslint-disable-line
	}
};

const captureException = (exception: Error): void => {
	if (sendToSentry[NODE_ENV]) {
		sentry.captureException(exception);
	} else {
		console.error(exception); // eslint-disable-line
	}
};

const addBreadcrumb = (
	category: string,
	message: string,
	data: object,
	level: sentry.Severity,
): void => {
	const breadcrumb = {
		category,
		message,
		data,
		level,
	};
	if (sendToSentry[NODE_ENV]) {
		sentry.addBreadcrumb(breadcrumb);
	} else {
		console.info(breadcrumb); // eslint-disable-line
	}
};

export {
	captureMessage,
	captureException,
	addBreadcrumb,
};
