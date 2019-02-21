import WidgetWeather from './WidgetWeather.vue';
export { default as settingsComponent } from './SettingsWeather.vue'
export { default as localeMessages } from './_locale';

export const gridComponents = {
	Weather: WidgetWeather
};

export const wallpaperComponents = {};

export const settings = {
	useCustomLocation: {
		name: 'useCustomLocation',
		getDefault: () => false
	},
	customLocation: {
		name: 'customLocation',
		getDefault: () => ({})
	},
	units: {
		name: 'units',
		getDefault: () => 'ca',

		options: [
			{ name: 'Metric', value: 'ca', localePath: 'weather.settings.metric' },
			{ name: 'Imperial', value: 'us', localePath: 'weather.settings.imperial' },
		]
	}
}

export const displayConfig = {
	Weather: {
		minWidth: 5,
		maxWidth: null,
		minHeight: 1,
		maxHeight: 5,
		canResize: true,
		canMove: true
	}
}