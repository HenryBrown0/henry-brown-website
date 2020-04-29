import { Severity } from '@sentry/node';
import databaseQuery from '../lib/database';
import { captureMessage, captureException } from '../helpers/logger';

interface IService {
	title: string;
	subtitle?: string;
	backgroundColor: string;
	isBackgroundDark: boolean;
	content: string;
}

const transformService = (service: any): IService => (
	{
		title: service.title,
		subtitle: service.subtitle,
		backgroundColor: service.backgroundcolor,
		isBackgroundDark: service.isbackgrounddark,
		content: service.content,
	}
);

const create = (): void => {
	captureMessage('Not yet implemented', Severity.Debug);
};

const read = async (name?: string): Promise<IService[]> => {
	if (name) {
		try {
			const queryResult = await databaseQuery(
				'SELECT title, subtitle, backgroundColor, isBackgroundDark, content FROM service WHERE title=$1',
				[name],
			);
			if (!queryResult.rowCount) return [];
			return queryResult.rows.map(transformService);
		} catch (error) {
			captureException(error);
			return [];
		}
	}

	try {
		const queryResult = await databaseQuery(
			'SELECT title, subtitle, backgroundColor, isBackgroundDark, content FROM service',
		);
		if (!queryResult.rowCount) return [];
		return queryResult.rows.map(transformService);
	} catch (error) {
		captureException(error);
		return [];
	}
};

const update = (): void => {
	captureMessage('Not yet implemented', Severity.Debug);
};

const remove = (): void => {
	captureMessage('Not yet implemented', Severity.Debug);
};

export default {
	create,
	read,
	update,
	remove,
};
