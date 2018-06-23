import lodashMerge from 'lodash.merge';
import { defaultSettings } from './defaultUserSettings';

export default {
	saveUpdatedSettings({ getters, commit, dispatch }, settings) {
		const currentSettings = getters.settingsWatch;
		
		dispatch('checkImmediateModuleUpdates', { settings, currentSettings });		

		const merged = lodashMerge(currentSettings, settings);
		commit('setSettingsData', merged);
	},

	checkImmediateModuleUpdates({ commit, dispatch }, { settings, currentSettings }) {
		/*
		need updates in components:
			quote category
			if: useCustomLocation => customLocationToUse
			wallpaper collection
		*/
		if (settings.quote.category !== currentSettings.quote.category) {
			console.log('quote cat changed');
			dispatch('quote/quoteSettingsChanged', null, {root: true});
		}

		const useCustomLocChanged = settings.weather.useCustomLocation !== currentSettings.weather.useCustomLocation;
		const customLocChanged = settings.weather.customLocationToUse !== currentSettings.weather.customLocationToUse;
		if (useCustomLocChanged) {
			if (!settings.weather.useCustomLocation) {
				//disable using custom location
				commit('setUseCustomLocation', false);
				console.warn("disable custom location");
				dispatch('weather/weatherSettingsChanged', { disable: true });
			} else {
				//enable use custom location
				console.warn("enable custom location");
				dispatch('weather/weatherSettingsChanged', { enable: true, newLocation: settings.weather.customLocationToUse });
			}
		} else if (settings.weather.useCustomLocation && customLocChanged) {
			//only update new custom location
			console.warn('use new custom location');
			dispatch('weather/weatherSettingsChanged', { newLocation: settings.weather.customLocationToUse });
		}

		if (settings.wallpaper.wallpaperCollection !== currentSettings.wallpaper.wallpaperCollection) {
			console.log('wallpaper collection changed');
			dispatch('wallpaper/wallpaperSettingsChanged');
		}
	},

	settingsSetFromStorage({ commit }, storageData) {
		const def = defaultSettings;
		const merged = lodashMerge(def, storageData);
		commit('setSettingsData', merged);
	},

	settingsStorageLoadFailed({ commit }) {
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

	moveWidget({ getters, commit }, { name, moveCols, moveRows }) {
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