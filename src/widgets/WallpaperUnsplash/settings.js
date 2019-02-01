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
			default: defaultSettings.collection
		},
		{
			name: 'refreshInterval',
			type: Number,
			default: defaultSettings.refreshInterval
		}
	]
}

export { config, defaultSettings };