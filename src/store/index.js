import Vue from 'vue'
import Vuex from 'vuex'

import Wallpaper from './Wallpaper'
import Greeting from './Greeting'
import Quote from './Quote'
import Weather from './Weather'
import News from './News'
import Settings from './Settings'

Vue.use(Vuex)

import createPersistedState from './utils/persist';
import widgetsApi from './api/index';
const userApi = widgetsApi.user;

import { defaultSettings } from './defaultUserSettings';
import { deepClone, deepMergeArray } from '../utils/deepObject';

const widgetsList = [
	'user',
	'wallpaper',
	'quote',
	'weather',
	'news'
]

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [createPersistedState('sp_', widgetsList)],

	modules: {
		Wallpaper,
		Greeting,
		Quote,
		Weather,
		News,
		Settings
	},

	state: {
		user: {
			language: defaultSettings.user.language,
			username: defaultSettings.user.name,
			fontSize: defaultSettings.user.fontSize,
			activeWidgets: defaultSettings.user.activeWidgets
		},
		editingUsername: false,
		widgets: widgetsList,
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
		widgets: state => state.widgets,
		activeWidgets: state => state.user.activeWidgets,
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
		setActiveWidgets: (state, widgets) => state.user.activeWidgets = [...widgets],
		setEditingUsername: (state, bool) => state.editingUsername = !!bool,
		toggleSettings(state, bool) {
			if (bool) state.showSettings = bool;
			else state.showSettings = !state.showSettings;
		},
		setGridPosition(state, { index, row, col }) {
			//let index = state.user.activeWidgets.findIndex(w => w.name === name);

			state.user.activeWidgets[index].row = [...row];
			state.user.activeWidgets[index].column = [...col];
		}
	},

	actions: {
		userStorageLoadFailed({ commit }) {
			commit('setLanguage', 'nl');
			commit('setFontSize', null);
			commit('setEditingUsername', true);
			commit('setActiveWidgets', defaultSettings.user.activeWidgets);
		},
		userSetFromStorage({ commit }, { username = "", language = "", fontSize = null, activeWidgets = defaultSettings.user.activeWidgets }) {
			commit('setUsername', username);
			commit('setLanguage', language);
			commit('setFontSize', fontSize);
			const mergedActiveWidgets = deepMergeArray(
				deepClone(defaultSettings.user.activeWidgets),
				deepClone(activeWidgets));
			commit('setActiveWidgets', mergedActiveWidgets);
		}
	}

})

export default store;
