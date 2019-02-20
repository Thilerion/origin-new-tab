import WallpaperUnsplash from './WallpaperUnsplash.vue';
import WidgetUnsplashDetails from './WidgetUnsplashDetails.vue';
export { default as settingsComponent } from './SettingsUnsplash.vue';
export { default as localeMessages } from './_locale';

export const gridComponents = {
	WidgetUnsplashDetails
};

export const wallpaperComponents = {
	WallpaperUnsplash
}

export const settings = {
	collection: {
		name: 'collection',
		getDefault: () => '220388,460827',

		options: [
			{ name: 'Featured', value: '220388,460827' },
			{ name: 'Landscape Light', value: '477172' },
			{ name: 'Spectrum', value: '540518' },
			{ name: 'Reflections', value: '334800' },
			{ name: 'Moody Landscapes', value: '1457745' },
			{ name: 'Leafy', value: '548245' },
			{ name: 'Above The Trees', value: '1525582' },
			{ name: 'The Deep Sea', value: '461104' }
		]
	},
	refreshInterval: {
		name: 'refreshInterval',
		getDefault: () => 0,

		options: [
			{ name: 'Every tab', value: 0 },
			{ name: '30 minutes', value: 30 * 60 * 1000 },
			{ name: 'Hourly', value: 60 * 60 * 1000 },
			{ name: 'Daily', value: 20 * 60 * 60 * 1000 },
			{ name: 'Never', value: Infinity }
		]
	}
}

export const displayConfig = {
	WidgetUnsplashDetails: {
		minWidth: 3,
		maxWidth: null,
		minHeight: 2,
		maxHeight: 5,
		canResize: true,
		canMove: true
	}
};