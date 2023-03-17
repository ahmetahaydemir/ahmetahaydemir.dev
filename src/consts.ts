export const SITE = {
	title: 'Wild Chess Simulator',
	description: 'Animal auto-battler with rogue-like gameplay',
	defaultLanguage: 'en-us',
} as const;

export const OPEN_GRAPH = {
	image: {
		src: 'https://github.com/withastro/astro/blob/main/assets/social/banner-minimal.png?raw=true',
		alt:
			'astro logo on a starry expanse of space,' +
			' with a purple saturn-like planet floating in the right foreground',
	},
	twitter: 'astrodotbuild',
};

export const KNOWN_LANGUAGES = {
	English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/withastro/astro/tree/main/examples/docs`;

export const COMMUNITY_INVITE_URL = `https://astro.build/chat`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
	indexName: 'XXXXXXXXXX',
	appId: 'XXXXXXXXXX',
	apiKey: 'XXXXXXXXXX',
};

import EntityDataJsonFile from '../public/EntityDataJsonFile.json'
// export let someName = EntityDataJsonFile.entityDataJsonArray[2].Name.toString();
export let entitySidebarList = EntityDataJsonFile.entityDataJsonArray.map((entry) => ({
	text: entry.Name, link: entry.Name.toLowerCase().split(' ').join('-')
}));

export type Sidebar = Record<
	(typeof KNOWN_LANGUAGE_CODES)[number],
	Record<string, { text: string; link: string }[]>
>;

export const SIDEBAR: Sidebar = {
	en: {
		'Introduction': [
			{ text: 'Welcome', link: `welcome` },
			{ text: 'Project Idea', link: `project-idea` },
			{ text: 'Entity List', link: `entity-list` },
		],
		'Devlog': [
			{ text: 'Color Theme - 1', link: 'color-theme' },
		],
		'Battle Entities': entitySidebarList,
	},
};
