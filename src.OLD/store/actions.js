import _merge from 'lodash.merge';
import { defaultSettings } from '@/store/libs/defaultUserSettings';
import mergeUserStorageIntoSettings from '@/store/libs/mergeUserStorageIntoSettings';
import { layouts as presetLayouts } from '@/store/libs/presetLayouts';

export default {
	setSettings({ commit }, settings) {
		if (settings.widgets) {
			const activeWidgets = [...settings.widgets];
			delete settings.widgets;
			commit('activeWidgets/setWidgets', activeWidgets);
		}

		commit('setSettingsData', settings);
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
	},

	usePresetLayout({ state, commit, dispatch }, key) {
		const settingsToAdd = presetLayouts[key];

		if (settingsToAdd.widgets) {
			const activeWidgets = [...settingsToAdd.widgets];
			delete settingsToAdd.widgets;
			commit('activeWidgets/setWidgets', activeWidgets);
		}

		const curSettings = state.settingsData;
		const merged = _merge(curSettings, settingsToAdd);
		commit('setSettingsData', merged);
	}
}