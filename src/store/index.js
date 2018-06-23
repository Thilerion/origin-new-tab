import Vue from 'vue'
import Vuex from 'vuex'

import Wallpaper from './modules/Wallpaper'
import Greeting from './modules/Greeting'
import Quote from './modules/Quote'
import Weather from './modules/Weather'
import News from './modules/News'
import Settings from './modules/Settings'
import Calendar from './modules/Calendar'

Vue.use(Vuex)

import createPersistedState from './libs/persist';
import { settingsOptions } from './defaultUserSettings';

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [createPersistedState('sp_', settingsOptions.widgets.storageModules)],

	modules: {
		Wallpaper,
		Greeting,
		Quote,
		Weather,
		News,
		Settings,
		Calendar
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
