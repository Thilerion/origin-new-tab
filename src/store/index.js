import Vue from 'vue'
import Vuex from 'vuex'

import Wallpaper from './Wallpaper'
import Greeting from './Greeting'
import Quote from './Quote'
import Weather from './Weather'
import News from './News'
import Settings from './Settings'
import Calendar from './Calendar'

Vue.use(Vuex)

import createPersistedState from './utils/persist';

import { defaultSettings, settingsOptions } from './defaultUserSettings';
import { deepClone, deepMergeArray } from '../utils/deepObject';

const windowHash = window.location.hash.substr(1);
const settingsPage = windowHash === "settings";

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [createPersistedState('sp_', settingsOptions.user.storageModules)],

	modules: {
		Wallpaper,
		Greeting,
		Quote,
		Weather,
		News,
		Settings,
		Calendar
	},

	state: {
		user: {
			language: defaultSettings.user.language,
			username: defaultSettings.user.name,
			fontSize: defaultSettings.user.fontSize,
			widgets: defaultSettings.user.widgets
		},
		editingUsername: false,
		showSettings: settingsPage,
		gridCols: null,
		gridRows: null
	},

	getters: {
		language: state => state.user.language,
		username: state => state.user.username,
		fontSize: state => state.user.fontSize,
		userWatch: state => state.user,
		isEditingUsername(state) {
			return state.editingUsername || !state.user.username;
		},
		widgets: state => state.user.widgets,
		showSettings: state => state.showSettings,
		gridCols: state => state.gridCols,
		gridRows: state => state.gridRows
	},

	mutations: {
		setUser: (state, userData) => state.user = { ...state.user, ...userData },
		setUsername: (state, username) => {
			state.editingUsername = false;
			state.user.username = username
		},
		setLanguage: (state, language) => state.user.language = language,
		setFontSize: (state, fontSize) => state.user.fontSize = fontSize,
		setWidgets: (state, widgets) => state.user.widgets = [...widgets],
		setSingleWidgetActive(state, { name, active }) {
			state.user.widgets.find(w => w.name === name).active = active;
		},
		setEditingUsername: (state, bool) => state.editingUsername = !!bool,
		toggleSettings(state, bool) {
			if (bool) state.showSettings = bool;
			else state.showSettings = !state.showSettings;

			if (bool === false) {
				console.log(window.location.hash);
				if (window.location.hash) {
					history.pushState("", document.title, window.location.pathname);
				}
			} else if (bool === true) {
				if (!window.location.hash) {
					history.pushState("", `${document.title} - Settings`, "#settings");
				}
			}
			console.log("Doc title: ", document.title);
			console.log(window.location.pathname);
		},
		setGridPosition(state, { index, moveCols, moveRows }) {
			let row = [...state.user.widgets[index].row].map(n => n += moveRows);
			let col = [...state.user.widgets[index].column].map(n => n += moveCols);
			state.user.widgets[index].column = [...col];
			state.user.widgets[index].row = [...row];
		},
		increaseFontSize(state, name) {
			const index = state.user.widgets.findIndex(w => w.name === name);
			if (state.user.widgets[index].fontSize != null) {
				state.user.widgets[index].fontSize += 1;
			}
		},
		decreaseFontSize(state, name) {
			const index = state.user.widgets.findIndex(w => w.name === name);
			if (state.user.widgets[index].fontSize != null) {
				state.user.widgets[index].fontSize -= 1;
			}
		},
		increaseWidgetWidth(state, {name, gridCols}) {
			const index = state.user.widgets.findIndex(w => w.name === name);
			const cols = state.user.widgets[index].column;

			if (cols[0] > 1) cols[0] -= 1;
			if (cols[1] < gridCols + 1) cols[1] += 1;

			state.user.widgets[index].column = [...cols];
		},
		decreaseWidgetWidth(state, {name, gridCols}) {
			const index = state.user.widgets.findIndex(w => w.name === name);
			const cols = state.user.widgets[index].column;

			const w = cols[1] - cols[0];
			if (w <= 5) return;

			cols[0] += 1;
			cols[1] -= 1;

			state.user.widgets[index].column = [...cols];
		},
		changeWidgetWidth(state, { name, gridCols, widgetCols, change }) {
			const minCol = 1;
			const maxCol = gridCols + 1;
			const curWidth = widgetCols[1] - widgetCols[0];
			const newWidgetCols = [...widgetCols];

			if (change > 0) {
				if (widgetCols[1] + change <= maxCol) {
					newWidgetCols[1] += change;
				} else if (widgetCols[0] - change >= minCol) {
					newWidgetCols[0] -= change;
				} else {
					console.warn("Can't change width. Max width reached?");
				}
			} else if (change < 0) {
				if (curWidth > 4) {
					newWidgetCols[1] += change;
				} else {
					console.warn("Can't change width. Min width reached?");
				}
			}
			state.user.widgets.find(w => w.name === name).column = [...newWidgetCols];
		},
		changeWidgetHeight(state, {name, gridRows, widgetRows, change}) {
			const minRow = 1;
			const maxRow = gridRows + 1;
			const curHeight = widgetRows[1] - widgetRows[0];
			const newWidgetRows = [...widgetRows];

			if (change > 0) {
				//increase height
				if (widgetRows[1] + change <= maxRow) {
					//increase widgetRows[1]
					newWidgetRows[1] += change;
				} else if (widgetRows[0] - change >= minRow) {
					//decrease widgetRows[0]
					newWidgetRows[0] -= change;
				} else {
					//can't change height
					console.warn("Can't change height. Max height reached?");
				}
			} else if (change < 0) {
				//decrease height
				if (curHeight > 2) {
					//decrease widgetRows[1]
					newWidgetRows[1] += change;
				} else {
					//can't change height: min height reached
					console.warn("Can't change height. Min height reached?");
				}
			}
			state.user.widgets.find(w => w.name === name).row = [...newWidgetRows];
		},
		setGridSize(state, { cols, rows }) {
			state.gridCols = cols;
			state.gridRows = rows;
		}
	},

	actions: {
		userStorageLoadFailed({ commit }) {
			commit('setLanguage', 'nl');
			commit('setFontSize', null);
			commit('setEditingUsername', true);
			commit('setWidgets', defaultSettings.user.widgets);
		},
		userSetFromStorage({ commit }, { username = "", language = "", fontSize = null, widgets = defaultSettings.user.widgets }) {
			commit('setUsername', username);
			commit('setLanguage', language);
			commit('setFontSize', fontSize);
			const mergedWidgets = deepMergeArray(
				deepClone(defaultSettings.user.widgets),
				deepClone(widgets));
			commit('setWidgets', mergedWidgets);
		},
		moveWidget({ state, commit }, { name, moveCols, moveRows }) {
			const index = state.user.widgets.findIndex(w => w.name === name);

			commit('setGridPosition', { index, moveCols, moveRows });
		}
	}

})

export default store;
