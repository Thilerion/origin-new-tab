export const general = {
	username: {
		name: 'username',
		getDefault: () => 'My Username',
	},
	language: {
		name: 'language',
		getDefault: () => 'en',

		options: [
			{ name: 'English', value: 'en' },
			{ name: 'Nederlands', value: 'nl' }
		]
	},
	timeFormat: {
		name: 'timeFormat',
		getDefault: () => 'HH:mm',

		options: [
			{ name: '24-hour', value: 'HH:mm' },
			{ name: '12-hour', value: 'h:mm a' }
		]
	}
};