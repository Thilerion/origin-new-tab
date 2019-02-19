import _merge from 'lodash.merge';
import { localeMessages } from '@/widgets';

const baseMessages = {
	en: {
		
	},
	nl: {
		
	}
};

const messages = _merge(baseMessages, localeMessages);
console.log(messages);
export default messages;