import lodashMerge from 'lodash.merge';
import { defaultSettings } from '@/store/libs/defaultUserSettings';
import mergeUserStorageIntoSettings from '@/store/libs/mergeUserStorageIntoSettings';

import {layouts as presetLayouts} from '@/store/libs/presetLayouts';

export default {
	saveUpdatedSettings({ getters, commit, dispatch }, settings) {
		const currentSettings = getters.settingsToWatch;

		if (settings.weather.useCustomLocation && !settings.weather.customLocationQuery) {
			settings.weather.useCustomLocation = false;
		}
		
		//dispatch('checkImmediateModuleUpdates', { settings, currentSettings });		

		const merged = lodashMerge(currentSettings, settings);
		commit('setSettingsData', merged);
	},

	settingsStorageLoadSuccess({ commit }, storageData) {
		if (storageData.greeting) {
			storageData.clock = storageData.greeting;
			delete storageData.greeting;
		}
		let greetingWidget = storageData.widgets.find(w => w.name === "greeting");
		if (greetingWidget) greetingWidget.name = "clock";
		
		const def = defaultSettings;
		const merged = lodashMerge(def, storageData);
		commit('setSettingsData', merged);
	},

	settingsStorageLoadFail({ commit }) {
		let oldUserData = window.localStorage.getItem('sp_user');
		if (!oldUserData) {
			commit('setSettingsData', defaultSettings);
			return;
		}
		
		const merged = mergeUserStorageIntoSettings(defaultSettings, oldUserData);

		window.localStorage.removeItem('sp_user');
		commit('setSettingsData', merged);
	},

	changeWidgetFontSize({ getters, commit }, { name, value }) {
		const index = getters.widgetIndexByName(name);
		commit('changeWidgetFontSize', { index, amount: value });
	},

	changeWidgetAlignment({ getters, commit }, { name, alignment }) {
		const index = getters.widgetIndexByName(name);
		commit('setWidgetAlignment', {index, alignment})
	},

	changeWidgetVerticalAlignment({ getters, commit }, { name, alignment }) {
		const index = getters.widgetIndexByName(name);
		commit('setWidgetVerticalAlignment', {index, alignment})
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
	},

	usePresetLayout({ getters, commit }, key) {
		const currentSettings = getters.settingsToWatch;
		const settingsToAdd = presetLayouts[key];
		const merged = lodashMerge(currentSettings, settingsToAdd);
		commit('setSettingsData', merged);

	}
}