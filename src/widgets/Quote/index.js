import WidgetQuote from './WidgetQuote.vue';

export { default as settingsComponent } from './SettingsQuote.vue';
export { default as localeMessages } from './_locale';

export const gridComponents = {
	WidgetQuote
};

export const wallpaperComponents = {};

export const settings = {
	category: {
		name: 'category',
		getDefault: () => 'motivinspirational',

		options: [
			{ name: 'Motivinspirational', value: 'motivinspirational' },
			{ name: 'Famous people', value: 'famous' },
			{ name: 'Movies', value: 'movies' },
		]
	}
}

export const displayConfig = {
	WidgetQuote: {
		minWidth: 6,
		maxWidth: null,
		minHeight: 1,
		maxHeight: 5,
		canResize: true,
		canMove: true
	}
}