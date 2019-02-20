import WidgetNews from './WidgetNews.vue';
export { default as settingsComponent } from './SettingsNews.vue'
export { default as localeMessages } from './_locale';

export const gridComponents = {
	WidgetNews
};

export const wallpaperComponents = {};

export const settings = {
	slideInterval: {
		name: 'slideInterval',
		getDefault: () => 6000, // 6 sec per item

		options: [
			{ name: '2 seconds', value: 2000 },
			{ name: '4 seconds', value: 4000 },
			{ name: '6 seconds', value: 6000 },
			{ name: '8 seconds', value: 8000 },
			{ name: '10 seconds', value: 10000 },
			{ name: '12 seconds', value: 12000 },
			{ name: 'Never (only manual)', value: -1 }
		]
	}
}

export const displayConfig = {
	WidgetNews: {
		minWidth: 5,
		maxWidth: null,
		minHeight: 1,
		maxHeight: 5,
		canResize: true,
		canMove: true
	}
}