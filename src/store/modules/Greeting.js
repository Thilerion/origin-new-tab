import localeMessages from '../../locale/greeting.locale.js';

const greetingStore = {
	namespaced: true,

	state: {		
		localeMessages
	},

	getters: {
		greetingMessages: (state, getters, rootState) => state.localeMessages[rootState.settingsData.general.language]
	},

	mutations: {
		
	},

	actions: {

	}

}

export default greetingStore;