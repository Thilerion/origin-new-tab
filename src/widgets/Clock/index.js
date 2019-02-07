import WidgetClock from './WidgetClock.vue';

export const gridComponents = {
	WidgetClock
}

export const wallpaperComponents = {
}

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