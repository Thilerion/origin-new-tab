import { presets } from '@/widgets';
import { LANGUAGES } from '@/constants';
import { getDefaultLocale } from '@/utils/locale';

export const general = {
	username: {
		name: 'username',
		getDefault: () => 'My Username',
	},
	language: {
		name: 'language',
		getDefault: () => getDefaultLocale(),

		options: LANGUAGES
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