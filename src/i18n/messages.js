import _merge from 'lodash.merge';
import { localeMessages } from '@/widgets';

const baseMessages = {
	en: {
		settings: {
			username: 'Username',
			language: 'Language',
			timeFormat: 'Time format',
			timeFormat24: '24-hour',
			timeFormat12: '12-hour'
		},
		settingCategory: {
			general: 'General',
			dashboard: 'Dashboard'
		}
	},
	nl: {
		settings: {
			username: 'Naam',
			language: 'Taal',
			timeFormat: 'Tijdnotatie',
			timeFormat24: '24-uurs',
			timeFormat12: '12-uurs'
		},
		settingCategory: {
			general: 'Algemeen',
			dashboard: 'Dashboard'
		}
	}
};

const messages = _merge(baseMessages, localeMessages);
console.log(messages);
export default messages;