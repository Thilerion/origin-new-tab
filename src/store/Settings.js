import { defaultSettings, settingsOptions } from './defaultUserSettings';
import { deepMergeArray } from '../utils/deepObject';

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
				fontSize: null
			},
			widgets: [],
			weather: {
				useCustomLocation: false
			},
			wallpaper: {
				wallpaperCollection: null,
				wallpaperCycleTimeout: null
			},
			quote: {
				category: ""
			},
			news: {},
			calendar: {}
		}
	},

	getters: {
		settingsWatch: state => state.settingsData,

		language: state => state.settingsData.general.language,
		username: state => state.settingsData.general.username,
		fontSize: state => state.settingsData.general.fontSize,
		widgets: state => state.settingsData.widgets,
		widgetByIndex: state => index => state.settingsData.widgets[index],
		widgetByName: state => name => state.settingsData.widgets.find(w => w.name === name),
		widgetIndexByName: state => name => state.settingsData.widgets.findIndex(w => w.name === name),
		useCustomLocation: state => state.settingsData.weather.useCustomLocation,
		wallpaperCollection: state => state.settingsData.wallpaper.wallpaperCollection,
		wallpaperCycleTimeout: state => state.settingsData.wallpaper.wallpaperCycleTimeout,
		quoteCategory: state => state.settingsData.quote.category,


		dndEnabled(state) {
			return state.dndEnabled;
		},
		showSettings(state) {
			return !!state.showSettings;
		},
		isEditingUsername(state) {
			return state.editingUsername || !state.settingsData.username;
		},
		gridCols: state => state.gridCols,
		gridRows: state => state.gridRows
	},

	mutations: {
		setSettingsData(state, settingsData) {
			state.settingsData = { ...settingsData };
		},
		setLanguage(state, language) {
			state.settingsData.general.language = language;
		},
		setUsername(state, username) {
			state.settingsData.general.username = username;
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
		setWallpaperCollection(state, collection) {
			state.settingsData.wallpaper.wallpaperCollection = collection;
		},
		setWallpaperCycleTimeout(state, timeout = 10) {
			state.settingsData.wallpaper.wallpaperCycleTimeout = timeout;
		},
		setQuoteCategory(state, category) {
			state.settingsData.quote.quoteCategory = category;
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
		saveSettings({ commit, dispatch }, { name, language, fontSize, wallpaperCollection, quoteCategory, widgets, wallpaperCycleTimeout, weatherSettings }) {
			if (name) commit('setUsername', name);			
			if (language) commit('setLanguage', language);
			if (fontSize !== undefined) commit('setFontSize', fontSize);
			if (wallpaperCollection) dispatch('setWallpaperCollection', wallpaperCollection);
			if (quoteCategory) commit('setQuoteCategory', quoteCategory);
			if (widgets) commit('setWidgets', widgets);
			if (wallpaperCycleTimeout) commit('setWallpaperCycleTimeout', wallpaperCycleTimeout);
			if (weatherSettings) dispatch('setCustomLocationFromSettings', weatherSettings);
		},

		settingsSetFromStorage({commit}, storageData) {
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