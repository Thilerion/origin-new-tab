import _merge from 'lodash.merge';
import { localeMessages } from '@/widgets';

const baseMessages = {
	en: {
		settings: {
			username: 'Username',
			language: 'Language',
			timeFormat: 'Time format'
		}
	},
	nl: {
		settings: {
			username: 'Naam',
			language: 'Taal',
			timeFormat: 'Tijdnotatie'
		}
	}
};

const messages = _merge(baseMessages, localeMessages);
console.log(messages);
export default messages;