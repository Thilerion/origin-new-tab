import { newsRequest as apiRequest } from '../api/';

const widgetName = "news";

const newsStore = {
	namespaced: true,
	
	state: {
		data: {
			articles: []
		},

		expires: null,
		
		finishedLoading: false,
		dataStatus: null
	},

	getters: {
		
		toWatch: state => ({ data: state.data, expires: state.expires }),
		hasExpired: state => (state.expires - Date.now() < 0),
		
		// dataStatus either fresh or stale, and loading is finished
		dataLoadSuccessful: state => state.dataStatus != null && state.finishedLoading,
		dataLoadFailed: state => state.dataStatus === null && state.finishedLoading,
		
		// TODO: specific function that returns true if the current state.data is not valid
		/*
		dataInvalid: state => {
			specific function here
		},
		*/
	},

	mutations: {
		setData(state, { data, expires }) {
			state.data = { ...data };
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
		settingsChanged({}) {
			console.log(`Settings for "${widgetName}"-module changed.`);
		},
		async storageLoadFail({ commit, dispatch }) {
			await dispatch('fetchApiData');
			commit('setFinishedLoading', true);
		},
		async storageLoadSuccess({ getters, commit, dispatch }, data) {
			dispatch('setLocalData', data);
			if (getters.hasExpired || getters.dataInvalid) {
				commit('setDataStatus', "stale");
				await dispatch('fetchApiData');
			} else {
				commit('setDataStatus', "fresh");
			}
			commit('setFinishedLoading', true);
		},
		setLocalData({ commit }, data) {
			commit('setData', data);
		},
		setApiData({ commit }, apiData) {
			commit('setData', apiData);
			commit('setDataStatus', "fresh");
		},
		async fetchApiData({ dispatch }) {
			try {
				let apiData = await apiRequest();
				dispatch('setApiData', {
					expires: apiData.expires,
					data: {
						// TODO: this is specific to this api return data
						articles: apiData.data
					}
				});
			} catch (e) {
				console.warn(`Could not load ${widgetName.toUpperCase()} api data...`);
				console.warn(e);
			}
		}
	}
}

export default newsStore;