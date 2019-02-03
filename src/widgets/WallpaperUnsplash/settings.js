import { WIDGET_TYPE_BG } from '@/constants.js';

const defaultSettings = {
	collection: '477172',
	refreshInterval: 1 * 60 * 60 * 10000 // 1 hour in ms
}

const config = {
	widgetType: WIDGET_TYPE_BG,
	hasComponent: true,
	hasStore: true,
	hasApi: true,
	settings: [
		{
			name: 'collection',
			type: String, // TODO: actually enum
			defaultValue: () => defaultSettings.collection
		},
		{
			name: 'refreshInterval',
			type: Number,
			defaultValue: () => defaultSettings.refreshInterval
		}
	],
	moduleData: {
		wallpapers: {
			validate(val) {
				return val && Array.isArray(val) && val.length > 0;
			},
			required: true,
			defaultValue: () => []
		},
		currentIdx: {
			validate(val, { wallpapers }) {
				return Number.isInteger(val) && wallpapers && wallpapers.length > val;
			},
			required: false,
			defaultValue: () => 0
		},
		hiddenIds: {
			validate(val) {
				return Array.isArray(val);
			},
			required: false,
			defaultValue: () => []
		},
		lastCurrentIdxChange: {
			validate(val) {
				return Number.isInteger(val);
			},
			required: false,
			defaultValue: () => null
		},
		lastArrayChange: {
			validate(val) {
				return Number.isInteger(val);
			},
			required: false,
			defaultValue: () => null
		},
		lastArrayChangeAmount: {
			validate(val, { wallpapers }) {
				return Number.isInteger(val) && wallpapers && val <= wallpapers.length;
			},
			required: false,
			defaultValue: ({wallpapers}) => wallpapers ? wallpapers.length : null
		}
	}
}

export { config, defaultSettings };