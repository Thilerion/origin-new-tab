import { ApiRequest } from '../common/api.service.js';
import { mergeStoreData, createWidgetStore } from '@/utils/createWidgetStore';

const STORE_NAME = 'news';
const STORAGE_KEY = 'sp_news';

const storeDataDefaults = {
	articles: []
}

const baseStore = {
	namespaced: true,
	state: {
		data: {},
		expires: null,

		finishedLoading: false,
		dataHasLoaded: false
	},
	getters: {
		hasExpired: state => (state.expires - Date.now() < 0),

		apiRequestParams(state, getters, rState) {
			const lang = rState.settings.general.language;
			return [
				'news',
				'/news',
				{ lang }
			];
		},

		showComponent(state) {
			return state.finishedLoading && state.dataHasLoaded;
		},
		errorLoading(state) {
			return state.finishedLoading && !state.dataHasLoaded;
		}
	},
	mutations: {
		setArticles(state, arr) {
			state.data.articles = [...arr];
		},
		setExpires(state, time) {
			state.expires = time;
		},
		setFinishedLoading(state, bool) {
			state.finishedLoading = bool;
		},
		setDataHasLoaded(state, bool) {
			state.dataHasLoaded = bool;
		}
	},
	actions: {
		async init({ state, getters, dispatch }) {
			let hasFetched,
				hasData;
			
			const hasLocalStorageData = state.data.articles.length > 0;
			const expired = getters.hasExpired;

			if (hasLocalStorageData) {
				if (expired) {
					hasFetched = await dispatch('fetchApiData');
				} else if (!expired) {
					hasFetched = true;
				}
				hasData = true;
			} else {
				hasFetched = await dispatch('fetchApiData');
				if (hasFetched) {
					hasData = true;
				} else {
					hasData = false;
				}
			}
			dispatch('finishInit', await hasData);
		},
		finishInit({commit}, success) {
			commit('setDataHasLoaded', !!success);
			commit('setFinishedLoading', true);
		},
		async fetchApiData({ dispatch }) {
			try {
				const response = await dispatch('makeRequest');
				const { data, expires } = response;
				dispatch('setApiData', { data, expires });
			} catch (e) {
				return false;
			}
		},
		makeRequest({ getters }) {
			return ApiRequest(...getters.apiRequestParams);
		},
		setApiData({ commit }, { data, expires }) {
			commit('setArticles', data);
			commit('setExpires', expires);
		}
	}
}

const mergedData = mergeStoreData(storeDataDefaults, STORAGE_KEY);
const { register, persist } = createWidgetStore(
	baseStore,
	mergedData,
	STORE_NAME,
	STORAGE_KEY,
	(state) => ({ data: state[STORE_NAME].data, expires: state[STORE_NAME].expires })
);

export { register, persist };