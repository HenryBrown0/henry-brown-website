import databaseQuery from '../lib/database';
import { captureException } from '../helpers/logger';

/* eslint-disable camelcase */
interface IRawRepository {
	id: string;
	name: string;
	description: string;
	updated_at: Date;
	is_archived: boolean;
	background_color: string;
	is_background_dark: boolean;
	git_hub_url: string;
	read_me: string;
}
/* eslint-enable camelcase */

const transformRepository = (repository: IRawRepository): IRepository => (
	{
		id: repository.id,
		name: repository.name,
		description: repository.description,
		updatedAt: new Date(repository.updated_at),
		isArchived: repository.is_archived,
		backgroundColor: repository.background_color,
		isBackgroundDark: repository.is_background_dark,
		gitHubUrl: repository.git_hub_url,
		readMe: repository.read_me,
	}
);

const create = async (repository: IRepository): Promise<Boolean> => {
	try {
		await databaseQuery(
			'INSERT INTO repository (id, name, description, updated_at, is_archived, background_color, is_background_dark, git_hub_url, read_me) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
			[
				repository.id,
				repository.name,
				repository.description,
				repository.updatedAt,
				repository.isArchived,
				repository.backgroundColor,
				repository.isBackgroundDark,
				repository.gitHubUrl,
				repository.readMe,
			],
		);
		return true;
	} catch (error) {
		captureException(error);
		return false;
	}
};

const read = async (name?: string): Promise<IRepository[]> => {
	if (name) {
		try {
			const queryResult = await databaseQuery(
				'SELECT id, name, description, updated_at, is_archived, background_color, is_background_dark, git_hub_url, read_me FROM repository WHERE id=$1',
				[name],
			);
			if (!queryResult.rowCount) return [];
			return queryResult.rows.map(transformRepository);
		} catch (error) {
			captureException(error);
			return [];
		}
	}

	try {
		const queryResult = await databaseQuery(
			'SELECT id, name, description, updated_at, is_archived, background_color, is_background_dark, git_hub_url, read_me FROM repository',
		);
		if (!queryResult.rowCount) return [];
		return queryResult.rows
			.map(transformRepository)
			.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
	} catch (error) {
		captureException(error);
		return [];
	}
};

const update = async (repository: IRepository): Promise<boolean> => {
	try {
		await databaseQuery(
			'UPDATE repository SET name=$2, description=$3, updated_at=$4, is_archived=$5, background_color=$6, is_background_dark=$7, git_hub_url=$8, read_me=$9 WHERE id=$1',
			[
				repository.id,
				repository.name,
				repository.description,
				repository.updatedAt,
				repository.isArchived,
				repository.backgroundColor,
				repository.isBackgroundDark,
				repository.gitHubUrl,
				repository.readMe,
			],
		);
		return true;
	} catch (error) {
		captureException(error);
		return false;
	}
};

const remove = async (id: string): Promise<boolean> => {
	try {
		await databaseQuery('DELETE FROM repository WHERE id=$1', [id]);
		return true;
	} catch (error) {
		captureException(error);
		return false;
	}
};

export default {
	create,
	read,
	update,
	remove,
};
