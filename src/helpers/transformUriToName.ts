const KEYWORDS = ['api', 'ssr'];

const transformUriToName = (uri: string): string => {
	const words = uri.split('-');
	const name = words.map((word) => {
		if (KEYWORDS.includes(word)) {
			return word.toUpperCase();
		}
		return word.slice(0, 1).toUpperCase() + word.slice(1);
	});

	return name.join(' ');
};

export default transformUriToName;
