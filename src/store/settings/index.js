// UTILS
import keysToLowerCase from '@/utils/keysToLowerCase';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import _merge from 'lodash.merge';

// SETTING OPTIONS
import { general, dashboard } from './baseSettings';
import { settings, settingCategoryOrder } from '@/widgets';

// VALIDATE AND MERGE SETTINGS
import { validateStoredSettings } from './createSettingsData';

/**
 * Load the setting options for each setting category,
 * converting the category names to lowercase.
 * 
 * Then, retrieve any settings from localStorage, and validate them against
 * the setting options and their default values.
 * 
 * Finally, save it all to localStorage again.
 */

export const STORAGE_KEY = 'sp_settings';

// The settings from localStorage that need to be validated
const userSettingOptions = keysToLowerCase({ general, ...settings });
// The settings from localStorage, combined with different settingOptions for the dynamic Settings components
const settingOptions = { dashboard, ...userSettingOptions };

const localSettingsData = getFromStorage(STORAGE_KEY);
const validatedSettings = validateStoredSettings(localSettingsData, userSettingOptions);

saveToStorage(STORAGE_KEY, validatedSettings);

export const settingsModule = {
	namespaced: false,

	state: {
		...validatedSettings,
	},
	getters: {
		settingsOptions: () => settingOptions,
		settingCategoryOrder: () => [
			{ name: 'General', value: 'general', localePath: 'settingCategory.general' },
			{ name: 'Dashboard', value: 'dashboard', localePath: 'settingCategory.dashboard' },
			...settingCategoryOrder
		]
	},
	mutations: {
		updateSettings(state, { key, settings }) {
			if (!state[key]) {
				console.warn(`No settings for "${key}" found!`);
				return;
			}

			const mergedSettings = _merge(state[key], settings);
			state[key] = { ...state[key], ...mergedSettings };
		}
	},
	actions: {

	}
};

export default settingsModule;