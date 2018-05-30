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
		username: state => state.user.username
	},

	mutations: {
		setUser: (state, userData) => state.user = {...state.user, ...userData}
	},

	actions: {
		initializeFromStorage({ commit, dispatch }) {
			let wallpaperData = loadFromStorage('wallpaper');
			if (wallpaperData) dispatch('wallpaperSet', wallpaperData);
			else dispatch('wallpaperLoadFailed');
		}
	}

})

initWatchers(store);
store.dispatch('initializeFromStorage');

export default store;
