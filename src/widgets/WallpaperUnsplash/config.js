import { WIDGET_TYPE_BG } from '@/constants.js';

const config = {
	name: 'unsplash',
	type: WIDGET_TYPE_BG,
	// hasComponent: true,
	// hasStore: true,
	// hasApi: true,
	settings: {
		collection: {
			validate(val) {
				// TODO: enum of collection options
				return Number.isInteger(parseInt(val));
			},
			required: true,
			defaultValue: () => '477172'
		},
		refreshInterval: {
			validate(val) {
				return Number.isInteger(val);
			},
			required: false,
			defaultValue: () => 1 * 60 * 60 * 10000 // 1 hour in ms
		}
	},
	moduleDataReducer: (state) => ({
		data: state.unsplash.data,
		expires: state.unsplash.expires
	}),
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

export { config };