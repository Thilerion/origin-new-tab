import WidgetWeather from './WidgetWeather.vue';
export { default as settingsComponent } from './SettingsWeather.vue'

export const gridComponents = {
	WidgetWeather
};

export const wallpaperComponents = {};

export const settings = {
	useCustomLocation: {
		name: 'useCustomLocation',
		getDefault: () => false
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