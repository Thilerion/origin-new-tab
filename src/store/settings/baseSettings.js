import { presets } from '@/widgets';

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

export const dashboard = {
	preset: {
		name: 'preset',
		options: [
			...Object.keys(presets).map(presetName => ({ name: presets[presetName].name, value: presetName }))
		]
	}
}