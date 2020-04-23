interface INavigationBarItemConfig {
	name: string;
	href: string;
}

interface INavigationBarItem extends INavigationBarItemConfig {
	isActive: boolean;
}

const navigationBarItems: INavigationBarItemConfig[] = [
	{
		name: 'Home',
		href: '',
	},
	{
		name: 'Blog',
		href: 'blog',
	}, {
		name: 'Projects',
		href: 'project',
	}, {
		name: 'Services',
		href: 'service',
	}, {
		name: 'Contact',
		href: 'contact',
	},
];

const getNavigationBarItems = (href: string): INavigationBarItem[] => (
	navigationBarItems.map((navigationBarItem) => ({
		...navigationBarItem,
		isActive: navigationBarItem.href === href,
	}))
);

export default getNavigationBarItems;
