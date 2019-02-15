// UTILS
import keysToLowerCase from '@/utils/keysToLowerCase';
import { getFromStorage, saveToStorage } from '@/utils/lsHelpers';
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

const settingOptions = keysToLowerCase({ general, dashboard, ...settings });
const localSettingsData = getFromStorage(STORAGE_KEY);
const validatedSettings = validateStoredSettings(localSettingsData, settingOptions);

saveToStorage(STORAGE_KEY, validatedSettings);

export const settingsModule = {
	namespaced: false,

	state: {
		...validatedSettings,
	},
	getters: {
		settingsOptions: () => ({
			...settingOptions
		}),
		settingCategoryOrder: () => [
			{ name: 'General', value: 'general' },
			{ name: 'Dashboard', value: 'dashboard' },
			...settingCategoryOrder
		]
	},
	mutations: {
		updateSettings(state, { key, settings }) {
			if (!state[key]) {
				console.warn(`No settings for "${key}" found!`);
				return;
			}

			state[key] = _merge(state[key], settings);
		}
	},
	actions: {

	}
};

export default settingsModule;