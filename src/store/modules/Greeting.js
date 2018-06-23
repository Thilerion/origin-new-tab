import localeMessages from '../../locale/greeting.locale.js';

const greetingStore = {

	state: {		
		localeMessages,
		timeFormat: 'HH:mm'
	},

	getters: {
		greetingMessages: (state, getters) => state.localeMessages[getters.language],
		timeFormat: state => state.timeFormat
	},

	mutations: {
		
	},

	actions: {

	}

}

export default greetingStore;