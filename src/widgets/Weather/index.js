import WidgetWeather from './WidgetWeather.vue';
export { default as settingsComponent } from './SettingsWeather.vue'
export { default as localeMessages } from './_locale';

export const gridComponents = {
	WidgetWeather
};

export const wallpaperComponents = {};

export const settings = {
	useCustomLocation: {
		name: 'useCustomLocation',
		getDefault: () => false
	},
	units: {
		name: 'units',
		getDefault: () => 'ca',

		options: [
			{ name: 'Metric', value: 'ca' },
			{ name: 'Imperial', value: 'us' }
		]
	}
}

export const displayConfig = {
	WidgetWeather: {
		minWidth: 5,
		maxWidth: null,
		minHeight: 1,
		maxHeight: 5,
		canResize: true,
		canMove: true
	}
}