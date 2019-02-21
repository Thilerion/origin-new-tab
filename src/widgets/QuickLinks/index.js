import WidgetQuickLinks from './WidgetQuickLinks.vue';
import SettingsQuickLinks from './SettingsQuickLinks.vue';
export { default as localeMessages } from './_locale';

export const gridComponents = {
	QuickLinks: WidgetQuickLinks
}

export const wallpaperComponents = {
}

export const settingsComponent = SettingsQuickLinks;

export const settings = {
	amount: {
		name: 'amount',
		getDefault: () => 10,

		options: {
			min: 1,
			max: 10,
			step: 1
		}
	},
	amountPerRow: {
		name: 'amountPerRow',
		getDefault: () => 5,

		options: {
			min: 1,
			max: 10,
			step: 1
		}
	}
}

export const displayConfig = {
	QuickLinks: {
		minWidth: 5,
		maxWidth: null,
		minHeight: 2,
		maxHeight: null,
		initialWidth: 24,
		initialHeight: 3,
		canResize: true,
		canMove: true
	}
};