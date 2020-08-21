import fs from 'fs';
import path from 'path';
import * as Sqrl from 'squirrelly';
import { captureException } from './helpers/logger';

const partialDirectory: string = path.join(__dirname, './templates/partials');

const setPartial = async (partialName: string, partialLocation: string) => {
	fs.readFile(partialLocation, (err, data) => {
		if (err) {
			captureException(err);
			throw err;
		}
		Sqrl.definePartial(partialName, data.toString('utf8'));
	});
};

const loadPartials = async () => {
	let dir: fs.Dir = null;

	try {
		dir = await fs.promises.opendir(partialDirectory);
	} catch (error) {
		captureException(error);
		throw error;
	}

	/* eslint-disable */
	for await (const dirent of dir) {
		const partialName = dirent.name.split('.')[0];
		const partialLocation = path.join(partialDirectory + '/' + dirent.name);

		try {
			await setPartial(partialName, partialLocation);
		} catch (error) {
			captureException(error);
			throw (error);
		}
	}
	/* eslint-enable */
};

export default loadPartials;
