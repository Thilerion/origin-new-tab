import Vue from 'vue'
import Vuex from 'vuex'

import Wallpaper from './modules/Wallpaper'
import Greeting from './modules/Greeting'
import Quote from './modules/Quote'
import Weather from './modules/Weather'
import News from './modules/News'
import Settings from './modules/Settings'
import Calendar from './modules/Calendar'

Vue.use(Vuex)

import createPersistedState from './libs/persist';

import { settingsOptions } from './defaultUserSettings';

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [createPersistedState('sp_', settingsOptions.widgets.storageModules)],

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
		/*userStorageLoadFailed({ commit }) {
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
		}*/
	}

})

export default store;
