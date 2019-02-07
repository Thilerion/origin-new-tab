import WidgetClock from './WidgetClock.vue';

export const gridComponents = {
	WidgetClock
}

export const wallpaperComponents = {
}

export const settings = {
	clockSettingA: {
		name: 'clockSettingA',
		getDefault: () => 'default Clock Setting A'
	},
	clockSettingB: {
		name: 'clockSettingB',
		getDefault: () => ['default', 'clock', 'settings', 'b']
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