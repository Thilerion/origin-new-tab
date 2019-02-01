import _merge from 'lodash.merge';
import { defaultSettings } from '@/store/libs/defaultUserSettings';
import mergeUserStorageIntoSettings from '@/store/libs/mergeUserStorageIntoSettings';

export default {
	setSettings({ commit }, settings) {
		const activeWidgets = [...settings.widgets];
		delete settings.widgets;

		commit('setSettingsData', settings);
		commit('activeWidgets/setWidgets', activeWidgets);
	},
	saveUpdatedSettings({ getters, dispatch }, settings) {
		const currentSettings = getters.settingsToWatch;

		if (settings.weather.useCustomLocation && !settings.weather.customLocationQuery) {
			settings.weather.useCustomLocation = false;
		}		

		const merged = _merge(currentSettings, settings);
		
		dispatch('setSettings', merged);
	},

	settingsStorageLoadSuccess({ dispatch }, storageData) {		
		const def = defaultSettings;
		const merged = _merge(def, storageData);

		dispatch('setSettings', merged);
	},

	settingsStorageLoadFail({ commit, dispatch }) {
		let oldUserData = window.localStorage.getItem('sp_user');
		if (!oldUserData) {
			commit('setSettingsData', defaultSettings);
			return;
		}
		
		const merged = mergeUserStorageIntoSettings(defaultSettings, oldUserData);

		window.localStorage.removeItem('sp_user');

		dispatch('setSettings', merged);
	}
}