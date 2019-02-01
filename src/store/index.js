import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import grid from './modules/grid.js';

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [],

	modules: {
		grid
	},

	state: {
		
	},

	getters: {},

	mutations: {},

	actions: {}
});

export default store;