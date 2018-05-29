import Vue from 'vue'
import Vuex from 'vuex'

import Wallpaper from './Wallpaper'
import Greeting from './Greeting'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		Wallpaper,
		Greeting
	},

	state: {
		language: 'NL',
		username: 'Michael'
	},

	getters: {
		language: state => state.language,
		username: state => state.username
	},

	mutations: {

	},

	actions: {

	}

})
