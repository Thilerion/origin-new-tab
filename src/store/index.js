import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import grid from './modules/grid';
import {settingsModule, settingsPersistPlugin} from './modules/settings';

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [settingsPersistPlugin],

	modules: {
		grid,
		settings: settingsModule
	},

	state: {
		
	},

	getters: {},

	mutations: {},

	actions: {}
});

export default store;