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
	},

	getters: {
	},

	mutations: {
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
