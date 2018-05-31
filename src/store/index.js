import Vue from 'vue'
import Vuex from 'vuex'

import Wallpaper from './Wallpaper'
import Greeting from './Greeting'
import Quote from './Quote'
import Weather from './Weather'

import { initWatchers, loadFromStorage } from './api';

Vue.use(Vuex)

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	modules: {
		Wallpaper,
		Greeting,
		Quote,
		Weather
	},

	state: {
		user: {
			language: '',
			username: ''
		},
		editingUsername: false
	},

	getters: {
		language: state => state.user.language,
		username: state => state.user.username,
		userWatch: state => state.user,
		isEditingUsername(state) {
			return state.editingUsername || !state.user.username;
		}
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
		initializeFromStorage({ commit, dispatch }) {
			let wallpaperData = loadFromStorage('wallpaper');
			if (wallpaperData) dispatch('wallpaperSet', wallpaperData);
			else dispatch('wallpaperLoadFailed');

			let userData = loadFromStorage('user');
			if (userData) dispatch('userSet', userData);
			else dispatch('userLoadFailed');

			let quoteData = loadFromStorage('quote');
			if (quoteData) dispatch('quoteSet', quoteData);
			else dispatch('quoteLoadFailed');

			let weatherData = loadFromStorage('weather');
			if (weatherData) dispatch('weatherSet', weatherData);
			else dispatch('weatherLoadFailed');
		},
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

initWatchers(store);
store.dispatch('initializeFromStorage');

export default store;
