import Vue from 'vue'
import Vuex from 'vuex'

import Wallpaper from './Wallpaper'
import Greeting from './Greeting'
import Quote from './Quote'
import Weather from './Weather'
import News from './News'

import { initWatchers, initFromStorage } from './api';

import createPersistedState from './utils/persist';

Vue.use(Vuex)

const widgets = [
	'user',
	'wallpaper',
	'quote',
	'weather',
	'news'
]

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [createPersistedState('sp_', widgets)],

	modules: {
		Wallpaper,
		Greeting,
		Quote,
		Weather,
		News
	},

	state: {
		user: {
			language: '',
			username: ''
		},
		editingUsername: false,
		widgets
	},

	getters: {
		language: state => state.user.language,
		username: state => state.user.username,
		userWatch: state => state.user,
		isEditingUsername(state) {
			return state.editingUsername || !state.user.username;
		},
		widgets: state => state.widgets
	},

	mutations: {
		setUser: (state, userData) => state.user = { ...state.user, ...userData },
		setUsername: (state, username) => {
			state.editingUsername = false;
			state.user.username = username
		},
		setLanguage: (state, language) => state.user.language = language,
		setEditingUsername: (state, bool) => state.editingUsername = !!bool
	},

	actions: {
		userSet({ commit }, userData) {
			commit('setUsername', userData.username);
			commit('setLanguage', userData.language);
		},
		userLoadFailed({ commit }) {
			console.warn("SETTING DEFAULT USER DATA");
			commit('setLanguage', 'NL');
			commit('setEditingUsername', true);
		}
	}

})

// initWatchers(store, store.getters.widgets);
// initFromStorage(store, store.getters.widgets);

console.log(store.wallpaperFromStorage());

export default store;
