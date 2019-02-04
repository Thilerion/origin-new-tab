import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import { gridModule, activeWidgetsPersistPlugin } from './modules/grid/';
import { settingsModule, settingsPersistPlugin } from './modules/settings';

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [settingsPersistPlugin, activeWidgetsPersistPlugin],

	modules: {
		grid: gridModule,
		settings: settingsModule
	},

	state: {
		
	},

	getters: {},

	mutations: {},

	actions: {}
});

export default store;