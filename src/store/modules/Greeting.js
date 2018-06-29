// import localeMessages from '../../i18n/greeting.locale.js';

const localeMessages = {
	nl: {
		timeOfDay: ['Goedemorgen', 'Hallo', 'Goedenavond', 'Goedenacht']
	},
	en: {
		timeOfDay: ['Good morning', "Hi", 'Good evening', 'Good night']
	}
}

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