import { RequestHandler } from 'express'; // eslint-disable-line
import repositoryModel from '../../models/repository';
import gitHubModel from '../../models/gitHub';
import getGitHubReadMe from '../../helpers/getGitHubReadMe';

const updateLocalRepository = async (remoteRepository: IRepository) => {
	const readMe = await getGitHubReadMe(remoteRepository.id);
	return repositoryModel.update({ ...remoteRepository, readMe });
};

const compareRepositoryTimes = (
	localRepository: IRepository,
	remoteRepository: IRepository,
) => (
	localRepository.updatedAt.getTime() >= remoteRepository.updatedAt.getTime()
);

const updateRepositories: RequestHandler = async (request, response) => {
	let updated = 0;
	let deleted = 0;
	let noAction = 0;

	const [localRepositories, remoteRepositories] = await Promise.all([
		repositoryModel.read(),
		gitHubModel.read(),
	]);

	await Promise.all(localRepositories.map(async (localRepository) => {
		const remoteRepositoryId = remoteRepositories.findIndex(({ id }) => (
			id === localRepository.id
		));

		if (remoteRepositoryId === -1) {
			deleted += 1;
			return repositoryModel.remove(localRepository.id);
		}

		const remoteRepository = remoteRepositories[remoteRepositoryId];
		remoteRepositories.splice(remoteRepositoryId, 1);

		if (compareRepositoryTimes(localRepository, remoteRepository)) {
			noAction += 1;
			return null;
		}

		updated += 1;
		return updateLocalRepository(remoteRepository);
	}));

	await Promise.all(remoteRepositories.map(async (remoteRepository) => {
		const readMe = await getGitHubReadMe(remoteRepository.id);
		return repositoryModel.create({ ...remoteRepository, readMe });
	}));

	return response.send({
		added: remoteRepositories.length,
		updated,
		deleted,
		noAction,
	});
};

export default updateRepositories;
