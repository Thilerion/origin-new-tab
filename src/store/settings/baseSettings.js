import { presets } from '@/widgets';
import { LANGUAGES } from '@/constants';
import { getDefaultLocale } from '@/utils/locale';

// import { i18n } from '@/i18n';

export const general = {
	username: {
		name: 'username',
		getDefault: () => '',
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
			{ name: '24-hour', value: 'HH:mm', localePath: 'settings.timeFormat24' },
			{ name: '12-hour', value: 'h:mm a', localePath: 'settings.timeFormat12' }
		]
	}
};

export const dashboard = {
	preset: {
		name: 'preset',
		options: [
			...Object.values(presets)
		]
	}
}