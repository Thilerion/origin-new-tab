import WidgetClock from './WidgetClock.vue';
import SettingsClock from './SettingsClock.vue';

export { default as localeMessages } from './_locale';

export const gridComponents = {
	WidgetClock
}

export const wallpaperComponents = {
}

export const settingsComponent = SettingsClock;

export const settings = {
	showDate: {
		name: 'showDate',
		getDefault: () => false
	},
	showTextGreeting: {
		name: 'showTextGreeting',
		getDefault: () => true
	}
}

export const displayConfig = {
	WidgetClock: {
		minWidth: 1,
		maxWidth: 40,
		canResize: true,
		canMove: true
	}
};