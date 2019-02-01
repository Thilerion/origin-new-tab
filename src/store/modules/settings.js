// Settings for each widget (not the instances, but the widget itself)
import { defaultWidgetSettings } from '@/widgets';

// Settings for the user
const defaultGeneralSettings = {
	language: "en",
	timeFormat: "HH:mm",
	username: "Michael"
};

// TODO: settings for activeWidgets
const defaultActiveWidgets = {
	activeWidgets: []
}

export default {
	namespaced: false,

	state: {
		general: { ...defaultGeneralSettings },
		...defaultActiveWidgets,
		...defaultWidgetSettings
	},

	getters: {

	},

	mutations: {

	},

	actions: {

	}
}