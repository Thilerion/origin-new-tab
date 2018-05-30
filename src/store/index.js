import Vue from 'vue'
import Vuex from 'vuex'

import Wallpaper from './Wallpaper'
import Greeting from './Greeting'
import { initWatchers, loadFromStorage } from './api';

Vue.use(Vuex)

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	modules: {
		Wallpaper,
		Greeting
	},

	state: {
		user: {
			language: 'NL',
			username: 'Michael'
		}		
	},

	getters: {
		language: state => state.user.language,
		username: state => state.user.username,
		userWatch: state => state.user
	},

	mutations: {
		setUser: (state, userData) => state.user = { ...state.user, ...userData },
		setUsername: (state, username) => state.user.username = username,
		setLanguage: (state, language) => state.user.language = language
	},

	actions: {
		initializeFromStorage({ commit, dispatch }) {
			let wallpaperData = loadFromStorage('wallpaper');
			if (wallpaperData) dispatch('wallpaperSet', wallpaperData);
			else dispatch('wallpaperLoadFailed');

			let userData = loadFromStorage('user');
			if (userData) dispatch('userSet', userData);
			else dispatch('userLoadFailed');
		},
		userSet({ commit }, userData) {
			commit('setUsername', userData.username);
			commit('setLanguage', userData.language);
		},
		userLoadFailed({ commit }) {
			console.warn("SETTING DEFAULT USER DATA");
			commit('setUser', { username: "Michael", language: 'NL' });
		}
	}

})

initWatchers(store);
store.dispatch('initializeFromStorage');

export default store;
