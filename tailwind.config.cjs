/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		colors: {
			'dark': '#121212',
			'darkgray': '#1f1f1f',
			'accentgray': '#3b3838',
			'fadedgray': '#3c3c3e',
			'gray': '#7b7676',
			'lightgray': '#d8dadc',
			'lightred': '#fca5a5',
			'red': '#95442f',
			'yellow': '#af9f49',
			'green': '#688a54'
		}
	},
	plugins: [],
}
