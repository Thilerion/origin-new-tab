// UTILS
import keysToLowerCase from '@/utils/keysToLowerCase';
import { getFromStorage, saveToStorage } from '@/utils/lsHelpers';

// SETTING OPTIONS
import { general } from './generalSettings';
import { settings } from '@/widgets';

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

const settingOptions = keysToLowerCase({ general, ...settings });
const localSettingsData = getFromStorage(STORAGE_KEY);
const validatedSettings = validateStoredSettings(localSettingsData, settingOptions);

saveToStorage(STORAGE_KEY, validatedSettings);

export const settingsModule = {
	namespaced: false,

	state: {
		...validatedSettings,
	},
	getters: {

	},
	mutations: {
		setUsername(state, name) {
			state.general.username = name;
		}
	},
	actions: {

	}
};

export default settingsModule;