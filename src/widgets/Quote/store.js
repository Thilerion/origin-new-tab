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

const STORE_NAME = 'quote';
const STORAGE_KEY = 'sp_quote';

const storeDataDefaults = {
	quote: "",
	author: ""
}
const mergedState = mergeStoreData(storeDataDefaults, STORAGE_KEY);

const baseState = createBaseState({
	data: mergedState.data,
	expires: mergedState.expires
});
const baseGetters = createBaseGetters({
	apiRequestParams(state, getters, rState) {
		const category = rState.settings.quote.category;
		return [
			'quote',
			'/quote',
			{ category }
		];
	},
	hasLocalStorageData(state) {
		return state.data.author && state.data.quote;
	}
});
const baseMutations = createBaseMutations({
	setData(state, data) {
		state.data.quote = data.quote;
		state.data.author = data.author;
	}
});
const baseActions = createBaseActions({
	finishInit({ commit }, success) {
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
		...baseActions,
		getNewQuote({commit, dispatch}) {
			commit('setExpires', Date.now());
			dispatch('fetchApiData');
		}
	},
}

const { register, persist } = createWidgetStore(
	store,
	STORE_NAME,
	STORAGE_KEY,
	(state) => ({ data: state[STORE_NAME].data, expires: state[STORE_NAME].expires })
);

export { register, persist };