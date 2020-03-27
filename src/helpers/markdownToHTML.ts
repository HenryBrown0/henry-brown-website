import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token'; // eslint-disable-line

const titleToSize: { [key: string]: string; } = {
	h1: 'is-hidden',
	h2: 'is-4',
	h3: 'is-5',
	h4: 'is-6',
};
const md = new MarkdownIt();
md.renderer.rules.heading_open = (tokens: Token[], idx: number) => {
	const { tag } = tokens[idx];
	return `<${tag} class='title ${titleToSize[tag]}'>`;
};

const renderHTML = (rawMarkdown: string): string => md.render(rawMarkdown);

export default renderHTML;
