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
// Collections
import { getCollection } from 'astro:content';
let devlogPosts = await getCollection("devlog");
devlogPosts.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

// Data Visualizations
import EntityDataJsonFile from '../public/data/EntityDataJsonFile.json'
import OriginDataJsonFile from '../public/data/OriginDataJsonFile.json'
import ClassDataJsonFile from '../public/data/ClassDataJsonFile.json'
import ObjectDataJsonFile from '../public/data/ObjectDataJsonFile.json'
import SkillDataJsonFile from '../public/data/SkillDataJsonFile.json'
let fullEntityArray = EntityDataJsonFile.battleEntityDataJsonArray.concat(EntityDataJsonFile.restEntityDataJsonArray).concat(EntityDataJsonFile.eventEntityDataJsonArray).concat(EntityDataJsonFile.treasureEntityDataJsonArray);
export const entitySidebarList = fullEntityArray.map((entry) => ({
	text: entry.Identifier, link: entry.Identifier.toLowerCase().split(' ').join('-')
}));
export const originSidebarList = OriginDataJsonFile.originDataJsonArray.map((entry) => ({
	text: entry.Identifier, link: entry.Identifier.toLowerCase().split(' ').join('-')
}));
export const classSidebarList = ClassDataJsonFile.classDataJsonArray.map((entry) => ({
	text: entry.Identifier, link: entry.Identifier.toLowerCase().split(' ').join('-')
}));
let fullObjectArray = ObjectDataJsonFile.equipmentObjectDataJsonArray.concat(ObjectDataJsonFile.nodeObjectDataJsonArray).concat(ObjectDataJsonFile.spawnObjectDataJsonArray);
export const objectSidebarList = fullObjectArray.map((entry) => ({
	text: entry.Identifier, link: entry.Identifier.toLowerCase().split(' ').join('-')
}));
let fullSkillArray = SkillDataJsonFile.battleSkillDataJsonArray.concat(SkillDataJsonFile.restSkillDataJsonArray).concat(SkillDataJsonFile.eventSkillDataJsonArray).concat(SkillDataJsonFile.treasureSkillDataJsonArray);
export const skillSidebarList = fullSkillArray.map((entry) => ({
	text: entry.Identifier, link: entry.Identifier.toLowerCase().split(' ').join('-')
}));
//
export type Sidebar = Record<
	(typeof KNOWN_LANGUAGE_CODES)[number],
	Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
	en: {
		'Introduction': [
			{ text: 'Welcome', link: `welcome` },
			{ text: 'Roadmap', link: `roadmap` }
		],
		'Devlog': devlogPosts.map(post => ({ text: post.data.title, link: post.data.title.toLowerCase().split(' ').join('-') })),
		'Library': [
			{ text: 'Freeform Table', link: `freeform-table` },
			{ text: 'Entity List', link: `entity-list` },
			{ text: 'Object List', link: `object-list` },
			{ text: 'Skill List', link: `skill-list` }
		],
		'Skills': skillSidebarList,
		'Classes': classSidebarList,
		'Origins': originSidebarList,
		'Entities': entitySidebarList,
		'Objects': objectSidebarList,
	},
};
