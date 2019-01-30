import Vue from 'vue'
import Vuex from 'vuex'

import wallpaper from './modules/Wallpaper'
import quote from './modules/Quote'
import weather from './modules/Weather'
import news from './modules/News'

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
		quote,
		weather,
		news,
	},

	state,

	getters,

	mutations,

	actions

})

export default store;
