import Vue from 'vue'
import Vuex from 'vuex'

import wallpaper from './modules/Wallpaper'
import greeting from './modules/Greeting'
import quote from './modules/Quote'
import weather from './modules/Weather'
import news from './modules/News'
import calendar from './modules/Calendar'

Vue.use(Vuex)

import { settingsOptions } from '@/store/libs/defaultUserSettings';
import createPersistedState from './libs/persist';

import mutations from './mutations';
import actions from './actions';
import { state, getters } from './state';


const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [createPersistedState('sp_', settingsOptions.widgets.storageModules)],

	modules: {
		wallpaper,
		greeting,
		quote,
		weather,
		news,
		calendar
	},

	state,

	getters,

	mutations,

	actions

})

export default store;
