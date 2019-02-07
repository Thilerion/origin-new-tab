import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import { persistModule } from '@/utils/storeModuleHelpers';

import { settingsModule, STORAGE_KEY as settingsStorageKey } from './settings';
import { gridModule, STORAGE_KEY as gridStorageKey } from './grid';

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [
		persistModule(
			(state) => ({ ...state.settings }),
			'settings',
			settingsStorageKey,
			{ deep: true, wait: 500, maxWait: 10000, immediate: true }
		),
		persistModule(
			(state) => ({ wallpaperWidget: state.grid.wallpaperWidget, gridWidgets: state.grid.gridWidgets }),
			'grid',
			gridStorageKey,
			{ deep: true, wait: 1000, maxWait: 10000, immediate: false }
		)
	],

	modules: {
		settings: settingsModule,
		grid: gridModule
	},

	state: {
		
	},

	getters: {},

	mutations: {},

	actions: {}
});

export default store;