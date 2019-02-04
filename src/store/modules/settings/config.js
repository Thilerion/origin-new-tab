import { LANGUAGES, TIME_FORMATS } from '@/constants';

// Settings for each widget (not the instances, but the widget itself)
import { widgetSettings } from '@/widgets';

// TODO: settings for the activeWidgets
// import .....

// Validation class
import { ERR_REQUIRED, default as Validator } from '@/utils/validate.js';

import { loadFromStorage } from '@/utils/lsHelpers';

const generalSettingsConfig = {
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

const settingConfigs = {
	general: generalSettingsConfig,
	...widgetSettings
};

/**
 * Retrieve from LocalStorage
 * Create validator class for every field in settingConfigs
 * Validate all, setting defaults if needed
 * Register store, setup watcher
 */

const storageData = loadFromStorage('sp_settings');

const settingValidatorClasses = {};
const validatedData = {};

// Create validators for each setting category, and validate the stored data
for (const [key, val] of Object.entries(settingConfigs)) {
	const validator = new Validator(val);
	settingValidatorClasses[key] = validator;
	
	const stored = (storageData && storageData[key]) || null;

	const validated = validator.validate(stored);
	validatedData[key] = validated;
}

export { validatedData };