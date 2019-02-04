// Settings for each widget (not the instances, but the widget itself)
import { widgetSettings } from '@/widgets';

// Settings for the user
import { generalSettingsConfig } from './config';

// TODO: settings for the activeWidgets
// import .....

// Validation class
import { ERR_REQUIRED, default as Validator } from '@/utils/validate.js';

// App helper functions
import { loadFromStorage, saveToStorage } from '@/utils/lsHelpers';
import _debounce from 'lodash.debounce';

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


const settingsModule = {
	namespaced: false,

	state: {
		...validatedData
	},

	getters: {

	},

	mutations: {

	},

	actions: {

	}
}

const settingsPersistPlugin = store => {
	const reducerFn = state => (state.settings);
	const watchCb = (newValue, oldValue) => {
		console.log(`Watcher is triggered for "settings" module.`);
		saveToStorage('sp_settings', newValue);
	}
	const debouncedCb = _debounce(
		watchCb,
		500,
		{ maxWait: 10000 }
	);

	store.watch(
		reducerFn,
		debouncedCb,
		{ deep: true }
	);

	console.log('Store watcher created for "SETTINGS" module, by plugin.');
};

export { settingsModule, settingsPersistPlugin };