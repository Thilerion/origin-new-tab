import WidgetQuote from './WidgetQuote.vue';

export { default as settingsComponent } from './SettingsQuote.vue';
export { default as localeMessages } from './_locale';

export const gridComponents = {
	Quote: WidgetQuote
};

export const wallpaperComponents = {};

export const settings = {
	category: {
		name: 'category',
		getDefault: () => 'motivinspirational',

		options: [
			{ name: 'Motivinspirational', value: 'motivinspirational', localePath: 'quote.settings.categoryOptions.motivinspirational' },
			{ name: 'Famous people', value: 'famous', localePath: 'quote.settings.categoryOptions.famous' },
			{ name: 'Movies', value: 'movies', localePath: 'quote.settings.categoryOptions.movies' },
		]
	}
}

export const displayConfig = {
	Quote: {
		minWidth: 6,
		maxWidth: null,
		minHeight: 1,
		maxHeight: 5,
		canResize: true,
		canMove: true
	}
}