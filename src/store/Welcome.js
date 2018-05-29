import localeMessages from '../locale/welcome.locale.js';

const welcomeStore = {

	state: {		
		localeMessages,
		timeFormat: 'HH:mm'
	},

	getters: {
		welcomeMessages: (state, getters) => state.localeMessages[getters.language],
		timeFormat: state => state.timeFormat
	},

	mutations: {
		
	},

	actions: {

	}

}

export default welcomeStore;