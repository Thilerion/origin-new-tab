import localeMessages from '../locale/welcome.locale.js';

const welcomeStore = {

	state: {
		timeFormat: [
			'HH:mm',
			'HH:mm:ss'
		],
		dateFormat: [
			'D-M-YYYY',
			'D MMM YYYY',
			'D MMMM YYYY'
		],
		dateFormatWithDay: [
			'dd D-M-YYYY',
			'ddd D MMM YYYY',
			'dddd D MMMM YYYY'
		],
		currentTimeFormat: 0,
		currentDateFormat: 0,
		currentDateFormatWithDay: 0,
		localeMessages
	},

	getters: {
		currentTimeFormat: state => state.timeFormat[state.currentTimeFormat],
		currentDateFormat: state => state.dateFormat[state.currentDateFormat],
		currentDateFormatWithDay: state => state.dateFormatWithDay[state.currentDateFormatWithDay],
		localizedMessages(state, getters) {
			const locale = getters.locale;
			console.log(locale);
			return state.localeMessages[locale];
		}
	},

	mutations: {
		
	},

	actions: {

	}

}

export default welcomeStore;