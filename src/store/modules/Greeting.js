import localeMessages from '../../locale/greeting.locale.js';

const greetingStore = {
	namespaced: true,

	state: {		
		localeMessages,
		timeFormat: 'HH:mm'
	},

	getters: {
		greetingMessages: (state, getters, rootState) => state.localeMessages[rootState.settingsData.general.language],
		timeFormat: state => state.timeFormat
	},

	mutations: {
		
	},

	actions: {

	}

}

export default greetingStore;