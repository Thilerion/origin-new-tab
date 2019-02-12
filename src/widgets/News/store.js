import {
	createBaseState,
	createBaseGetters,
	createBaseMutations,
	createBaseActions
} from '../common/base-store.js';

import {
	mergeStoreData,
	createWidgetStore
} from '@/utils/createWidgetStore';

const STORE_NAME = 'news';
const STORAGE_KEY = 'sp_news';

// Load data from localStorage, and merge with defaults
const storeDataDefaults = {
	articles: []
}
const mergedState = mergeStoreData(storeDataDefaults, STORAGE_KEY);

// Create state, using the mergedData object
const baseState = createBaseState({
	data: mergedState.data,
	expires: mergedState.expires
});
const baseGetters = createBaseGetters({
	apiRequestParams(state, getters, rState) {
		const lang = rState.settings.general.language;
		return [
			'news',
			'/news',
			{ lang }
		];
	},
	hasLocalStorageData(state) {
		return state.data.articles.length > 0;
	}
});
const baseMutations = createBaseMutations({
	setData(state, arr) {
		state.data.articles = [...arr];
	}
});
const baseActions = createBaseActions({
	finishInit({commit}, success) {
		commit('setDataHasLoaded', !!success);
		commit('setFinishedLoading', true);
	},
	setApiData({ commit }, { data, expires }) {
		commit('setData', data);
		commit('setExpires', expires);
	}
})

const store = {
	namespaced: true,
	state: {
		...baseState
	},
	getters: {
		...baseGetters
	},
	mutations: {
		...baseMutations
	},
	actions: {
		...baseActions
	},
}

const { register, persist } = createWidgetStore(
	store,
	STORE_NAME,
	STORAGE_KEY,
	(state) => ({ data: state[STORE_NAME].data, expires: state[STORE_NAME].expires })
);

export { register, persist };