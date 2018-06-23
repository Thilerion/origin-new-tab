import Vue from 'vue'
import Vuex from 'vuex'

import wallpaper from './modules/Wallpaper'
import greeting from './modules/Greeting'
import quote from './modules/Quote'
import weather from './modules/Weather'
import news from './modules/News'
import settings from './modules/Settings'
import calendar from './modules/Calendar'

Vue.use(Vuex)

import createPersistedState from './libs/persist';
import { settingsOptions } from './defaultUserSettings';

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [createPersistedState('sp_', settingsOptions.widgets.storageModules)],

	modules: {
		wallpaper,
		greeting,
		quote,
		weather,
		news,
		settings,
		calendar
	},

	state: {
		
	},

	getters: {

	},

	mutations: {
		
	},

	actions: {
	
	}

})

export default store;
