import lodashMerge from 'lodash.merge';
import { defaultSettings } from '@/store/libs/defaultUserSettings';

export default {
	saveUpdatedSettings({ getters, commit, dispatch }, settings) {
		const currentSettings = getters.settingsWatch;

		if (settings.weather.useCustomLocation && !settings.weather.customLocationQuery) {
			settings.weather.useCustomLocation = false;
		}
		
		//dispatch('checkImmediateModuleUpdates', { settings, currentSettings });		

		const merged = lodashMerge(currentSettings, settings);
		commit('setSettingsData', merged);
	},

	settingsStorageLoadSuccess({ commit }, storageData) {
		const def = defaultSettings;
		const merged = lodashMerge(def, storageData);
		commit('setSettingsData', merged);
	},

	settingsStorageLoadFail({ commit }) {
		commit('setSettingsData', defaultSettings);	
	},

	changeWidgetFontSize({ getters, commit }, { name, value }) {
		const index = getters.widgetIndexByName(name);
		commit('changeWidgetFontSize', { index, amount: value });
	},

	changeWidgetAlignment({ getters, commit }, { name, alignment }) {
		const index = getters.widgetIndexByName(name);
		commit('setWidgetAlignment', {index, alignment})
	},

	moveWidget({ getters, commit }, { name, moveCols = 0, moveRows = 0 }) {
		commit('setWidgetPositionOnGrid', {
			index: getters.widgetIndexByName(name),
			moveCols,
			moveRows
		});
	},
	resizeWidget({ getters, commit }, { name, cols, rows }) {
		commit('setWidgetSizeOnGrid', {
			index: getters.widgetIndexByName(name),
			cols,
			rows
		})
	}
}