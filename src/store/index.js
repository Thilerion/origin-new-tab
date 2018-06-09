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
import widgetsApi from './api/index';
const userApi = widgetsApi.user;

import { defaultSettings, settingsOptions } from './defaultUserSettings';
import { deepClone, deepMergeArray } from '../utils/deepObject';

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [createPersistedState('sp_', settingsOptions.user.widgets.haveStorageModule)],

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
		showSettings: false
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
		showSettings: state => state.showSettings
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
		setEditingUsername: (state, bool) => state.editingUsername = !!bool,
		toggleSettings(state, bool) {
			if (bool) state.showSettings = bool;
			else state.showSettings = !state.showSettings;
		},
		setGridPosition(state, { name, row, col }) {
			const index = state.user.widgets.findIndex(w => w.name === name);
			state.user.widgets[index].row = [...row];
			state.user.widgets[index].column = [...col];
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
		}
	}

})

export default store;
