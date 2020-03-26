import fs from 'fs';
import path from 'path';
import * as Sqrl from 'squirrelly';

const partialDirectory = path.join(__dirname, '../partials');

const loadPartials = async () => {
	const dir = await fs.promises.opendir(partialDirectory);
	for await (const dirent of dir) {
		const partialName = dirent.name.split('.')[0];
		const partialLocation = path.join(__dirname, '../partials/' + dirent.name);

		await setPartial(partialName, partialLocation);
	}
};

const setPartial = async (partialName: string, partialLocation: string) => {
	fs.readFile(partialLocation, (err, data) => {
		if (err) {
			throw err;
		}
		Sqrl.definePartial(partialName, data.toString('utf8'));
	});
};

export default loadPartials;
