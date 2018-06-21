import { defaultSettings, settingsOptions } from './defaultUserSettings';
import { deepClone, deepMergeArray } from '../utils/deepObject';

import lodashMerge from 'lodash.merge';

const settingsStore = {

	state: {
		dndEnabled: false,
		showSettings: window.location.hash.substr(1) === 'settings',
		gridCols: null,
		gridRows: null,
		editingUsername: false,

		settingsData: {
			general: {
				language: null,
				username: '',
				fontSize: null,
				showTextGreeting: null
			},
			widgets: [],
			weather: {
				useCustomLocation: false,
				customLocationToUse: ""
			},
			wallpaper: {
				wallpaperCollection: null,
				wallpaperRefresh: null
			},
			quote: {
				category: ""
			},
			news: {
				slideInterval: null
			},
			calendar: {}
		}
	},

	getters: {
		settingsWatch: state => state.settingsData,

		language: state => state.settingsData.general.language,
		username: state => state.settingsData.general.username,
		fontSize: state => state.settingsData.general.fontSize,
		showTextGreeting: state => state.settingsData.general.showTextGreeting,
		widgets: state => state.settingsData.widgets,
		widgetByIndex: state => index => state.settingsData.widgets[index],
		widgetByName: state => name => state.settingsData.widgets.find(w => w.name === name),
		widgetIndexByName: state => name => state.settingsData.widgets.findIndex(w => w.name === name),
		useCustomLocation: state => state.settingsData.weather.useCustomLocation,
		customLocationToUse: state => state.settingsData.weather.customLocationToUse,
		locationToUse: (state, getters) => {
			return state.settingsData.weather.customLocationToUse || getters.addressCity;
		},
		wallpaperCollection: state => state.settingsData.wallpaper.wallpaperCollection,
		wallpaperRefresh: state => state.settingsData.wallpaper.wallpaperRefresh,
		quoteCategory: state => state.settingsData.quote.category,
		newsSlideInterval: state => state.settingsData.news.slideInterval,


		dndEnabled(state) {
			return state.dndEnabled;
		},
		showSettings(state) {
			return !!state.showSettings;
		},
		isEditingUsername(state) {
			return state.editingUsername || !state.settingsData.general.username;
		},
		gridCols: state => state.gridCols,
		gridRows: state => state.gridRows
	},

	mutations: {
		setSettingsData(state, settingsData) {
			console.log(settingsData);
			state.settingsData = { ...deepClone(settingsData) };
		},
		setLanguage(state, language) {
			state.settingsData.general.language = language;
		},
		setUsername(state, username) {
			state.settingsData.general.username = username;
			if (state.editingUsername) state.editingUsername = false;
		},
		setFontSize(state, fontSize = null) {
			state.settingsData.general.fontSize = fontSize;
		},
		setWidgets(state, widgets) {
			state.settingsData.widgets = [...widgets];
		},
		setWidgetActive(state, { name, active }) {
			state.settingsData.widgets.find(w => w.name === name).active = active;
		},
		setUseCustomLocation(state, bool) {
			//TODO: dispatch to weather component (from action)
			state.settingsData.weather.useCustomLocation = !!bool;
		},
		setCustomLocationToUse(state, loc) {
			state.settingsData.weather.customLocationToUse = loc;
		},
		setWallpaperCollection(state, collection) {
			state.settingsData.wallpaper.wallpaperCollection = collection;
		},
		setWallpaperRefresh(state, timeout = 10) {
			state.settingsData.wallpaper.wallpaperRefresh = timeout;
		},
		setQuoteCategory(state, category) {
			state.settingsData.quote.category = category;
		},
		setNewsSlideInterval(state, interval) {
			state.settingsData.news.slideInterval = interval;
		},
		
		toggleDnd(state) {
			state.dndEnabled = !state.dndEnabled;
		},
		setShowSettings(state, bool) {
			if (bool == null) {
				state.showSettings = !state.showSettings;
				return;
			}			
			state.showSettings = bool;
			if (!bool && window.location.hash) {
				history.pushState("", document.title, window.location.pathname);
			} else if (bool && !window.location.hash) {
				history.pushState("", document.title, '#settings');
			}
		},
		setEditingUsername(state, bool) {
			state.editingUsername = !!bool;
		},
		setGridSize(state, { cols, rows }) {
			state.gridCols = cols;
			state.gridRows = rows;
		},
		setWidgetPositionOnGrid(state, { index, moveCols, moveRows }) {
			let row = [...state.settingsData.widgets[index].row].map(n => n += moveRows);
			let col = [...state.settingsData.widgets[index].column].map(n => n += moveCols);
			state.settingsData.widgets[index].column = [...col];
			state.settingsData.widgets[index].row = [...row];
		},
		setWidgetSizeOnGrid(state, { index, cols, rows }) {
			state.settingsData.widgets[index].column = [...cols];
			state.settingsData.widgets[index].row = [...rows];
		}
	},

	actions: {
		saveUpdatedSettings({ getters, commit, dispatch }, settings) {
			const currentSettings = getters.settingsWatch;
			

			dispatch('checkImmediateModuleUpdates', { settings, currentSettings });

			const merged = lodashMerge(currentSettings, settings);
			commit('setSettingsData', merged);
		},

		checkImmediateModuleUpdates({ dispatch }, { settings, currentSettings }) {
			/*
			need updates in components:
				quote category
				if: useCustomLocation => customLocationToUse
				wallpaper collection
			*/
			if (settings.quote.category !== currentSettings.quote.category) {
				console.log('quote cat changed');
				dispatch('quoteSettingsChanged');
			}

			const useCustomLocChanged = settings.weather.useCustomLocation !== currentSettings.weather.useCustomLocation;
			const customLocChanged = settings.weather.customLocationToUse !== currentSettings.weather.customLocationToUse;
			if (useCustomLocChanged) {
				if (!settings.weather.useCustomLocation) {
					//disable using custom location
					dispatch('weatherSettingsChanged', { disable: true });
				} else {
					//enable use custom location
					dispatch('weatherSettingsChanged', { enable: true, newLocation: settings.weather.customLocationToUse });
				}
			} else if (settings.weather.useCustomLocation && customLocChanged) {
				//only update new custom location
				dispatch('weatherSettingsChanged', { newLocation: settings.weather.customLocationToUse });
			}

			if (settings.wallpaper.wallpaperCollection !== currentSettings.wallpaper.wallpaperCollection) {
				console.log('wallpaper collection changed');
				dispatch('wallpaperSettingsChanged');
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

}

export default settingsStore;