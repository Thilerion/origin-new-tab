import validators from '@/utils/form-generator/validators';

export const general = {
	username: {
		name: 'username',
		getDefault: () => 'My Username',
		
		type: 'input',
		inputType: 'text',
		label: 'Username',
		validator: validators.string,
		min: 1,
		max: 30,
		required: true
	},
	language: {
		name: 'language',
		getDefault: () => 'en',

		type: 'radio',
		values: [
			{ name: 'English', value: 'en' },
			{ name: 'Nederlands', value: 'nl' }
		],
		label: 'Language'
	},
	timeFormat: {
		name: 'timeFormat',
		getDefault: () => 'HH:mm',

		type: 'radio',
		values: [
			{ name: '24-hour', value: 'HH:mm' },
			{ name: '12-hour', value: 'h:mm a' }
		],
		label: 'Time Format'
	}
};