import { WIDGET_TYPE_GRID } from '@/constants.js';

const config = {
	name: 'clock',
	type: WIDGET_TYPE_GRID,
	hasComponent: true,
	hasStore: false,
	hasApi: false,
	settings: {
		showDate: {
			validate(val) {
				//is boolean check
				return (typeof val === typeof true) ||
					(val === "true" || val === "false");
			},
			required: true,
			defaultValue: () => false
		},
		showTextGreeting: {
			validate(val) {
				//is boolean check
				return (typeof val === typeof true) ||
					(val === "true" || val === "false");
			},
			required: true,
			defaultValue: () => true
		}
	}
}

export { config };