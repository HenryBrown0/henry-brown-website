import fs from 'fs';
import path from 'path';
import * as Sqrl from 'squirrelly';

const partialDirectory: string = path.join(__dirname, '../partials');

const setPartial = async (partialName: string, partialLocation: string) => {
	fs.readFile(partialLocation, (err, data) => {
		if (err) {
			throw err;
		}
		Sqrl.definePartial(partialName, data.toString('utf8'));
	});
};

const loadPartials = async () => {
	const dir: fs.Dirent[] = await fs.promises.opendir(partialDirectory);

	dir.forEach(async (dirent: fs.Dirent) => {
		const partialName = dirent.name.split('.')[0];
		const partialLocation = path.join(__dirname, `../partials/${dirent.name}`);

		await setPartial(partialName, partialLocation);
	});
};

export default loadPartials;
