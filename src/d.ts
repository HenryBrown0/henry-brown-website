interface IRepository {
	id: string;
	name: string;
	description: string;
	updatedAt: Date;
	isArchived: boolean;
	backgroundColor: string;
	isBackgroundDark: boolean;
	gitHubUrl: string;
	readMe?: string;
	images: {
		src: string,
		thumbnail: string,
		alt: string,
	}[];
}
