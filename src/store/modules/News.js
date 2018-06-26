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

		dataLoadSuccessful(state) {
			//dataStatus either "fresh" or "stale" and loading is finished
			return state.dataStatus != null && state.finishedLoading;
		},

		dataLoadFailed(state) {
			//this means data could not be loaded
			return state.dataStatus === null && state.finishedLoading;
		}

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
					articles: apiData.data
				});
			} catch (e) {
				console.warn("Could not load NEWS api data...");
				console.warn(e);
			}
		}
	}

}

export default newsStore;