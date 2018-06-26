import {newsRequest as apiRequest} from '../api/';

const newsStore = {
	namespaced: true,

	state: {
		expires: null,
		articles: [],
		finishedLoading: false,
		dataStatus: null
	},

	getters: {
		// COMMMON GETTERS
		toWatch(state) {
			const { expires, articles } = state;
			return { expires, articles };
		},
		hasExpired(state) {
			return state.expires - new Date().getTime() < 0;
		},

		// UNIQUE GETTERS
	},

	mutations: {
		// COMMON MUTATIONS
		setData(state, {articles, expires}) {
			state.articles = [...articles];
			state.expires = expires;
		},
		setFinishedLoading(state, bool) {
			state.finishedLoading = !!bool;
		},
		setDataStatus(state, status) {
			state.dataStatus = status;
		}
	},

	actions: {
		// COMMON ACTIONS
		settingsChanged() {
			//
		},
		async storageLoadFail() {
			await dispatch('fetchApiData');
			commit('setFinishedLoading', true);
		},
		async storageLoadSuccess({ getters, commit, dispatch }, localData) {
			dispatch('setLocalData', localData);
			if (getters.hasExpired) {
				commit('setDataStatus', "stale");
				await dispatch('fetchApiData');
			} else {
				commit('setDataStatus', "fresh");
			}
			commit('setFinishedLoading', true);
		},
		setLocalData({commit}, localData) {
			commit('setData', localData);
		},
		setApiData({commit}, apiData) {
			commit('setData', apiData);
			commit('setDataStatus', "fresh");
		},
		async fetchApiData({dispatch}) {
			try {
				let apiData = await apiRequest();
				dispatch('setApiData', {
					expires: apiData.expires,
					articles: apiData.data.articles
				});
			} catch (e) {
				console.warn("Could not load NEWS api data...");
				console.warn(e);
			}
		},



		/*
		async getNewsFromServer({ dispatch }, commitOnFail) {
			try {
				let data = await apiRequest({});				
				dispatch('newsSetFromApi', data);
			}
			catch (e) {
				if (commitOnFail) {
					console.warn("Error in getting news from server. However, old date will be committed now. ", e);
					dispatch('newsSetFromStorage', commitOnFail);
				} else {
					console.warn("Error in getting news from server. ", e);
				}
			}
		},
		storageLoadFail({ dispatch }) {
			dispatch('getNewsFromServer');
		},
		storageLoadExpired({ dispatch }, data) {
			//should commit data if getting from server fails
			dispatch('getNewsFromServer', data);					
		},
		storageLoadSuccess({ commit, dispatch }, localData) {
			const { articles = [], expires } = localData;
			if (expires - new Date().getTime() < 0) return dispatch('storageLoadExpired', localData);
			else commit('setData', { articles, expires });
		},
		newsSetFromApi({ commit }, apiData) {
			const { data: articles = [], expires } = apiData;
			commit('setData', { articles, expires });
		}*/
	}

}

export default newsStore;