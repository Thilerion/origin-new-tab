import { LANGUAGES, TIME_FORMATS } from '@/constants';

export const generalSettingsConfig = {
	language: {
		validate(val) {
			return String(val) === val && LANGUAGES.includes(val);
		},
		required: false,
		// TODO: use function to find user UI language
		defaultValue: () => 'en'
	},
	timeFormat: {
		validate(val) {
			return String(val) === val && TIME_FORMATS.includes(val);
		},
		required: false,
		defaultValue: () => 'HH:mm'
	},
	username: {
		validate(val) {
			return String(val) === val;
		},
		required: false,
		defaultValue: () => ''
	}
}