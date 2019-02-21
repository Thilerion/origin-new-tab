import WidgetNews from './WidgetNews.vue';
export { default as settingsComponent } from './SettingsNews.vue'
export { default as localeMessages } from './_locale';

export const gridComponents = {
	News: WidgetNews
};

export const wallpaperComponents = {};

export const settings = {
	slideInterval: {
		name: 'slideInterval',
		getDefault: () => 6000, // 6 sec per item

		options: [
			{ name: '2 seconds', value: 2000, localePath: 'news.settings.slideOptions[0]' },
			{ name: '4 seconds', value: 4000, localePath: 'news.settings.slideOptions[1]' },
			{ name: '6 seconds', value: 6000, localePath: 'news.settings.slideOptions[2]' },
			{ name: '8 seconds', value: 8000, localePath: 'news.settings.slideOptions[3]' },
			{ name: '10 seconds', value: 10000, localePath: 'news.settings.slideOptions[4]' },
			{ name: '12 seconds', value: 12000, localePath: 'news.settings.slideOptions[5]' },
			{ name: 'Never (only manual)', value: -1, localePath: 'news.settings.slideOptions[6]' },
		]
	}
}

export const displayConfig = {
	News: {
		minWidth: 5,
		maxWidth: null,
		minHeight: 1,
		maxHeight: 5,
		canResize: true,
		canMove: true
	}
}