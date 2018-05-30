import Vue from 'vue'
import Vuex from 'vuex'

import Wallpaper from './Wallpaper'
import Greeting from './Greeting'

Vue.use(Vuex)

const store = new Vuex.Store({
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
			const user = localStorage.getItem('sp_user');
			if (user) commit('setUser', JSON.parse(user));

			dispatch('getWallpapersFromStorage');
		}
	}

})

store.dispatch('initializeFromStorage');

export default store;
