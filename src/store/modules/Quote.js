import widgetsApi from '../api';
const quoteApi = widgetsApi.quote;

const quoteStore = {
	namespaced: true,

	state: {
		randomQuote: {},
		expires: null,
		finishedLoading: false,		//true, false
		dataStatus: null			//fresh, stale, null
	},

	getters: {
		toWatch(state) {
			const { randomQuote, expires } = state;
			return { randomQuote, expires };
		},
		hasExpired(state) {
			return state.expires - new Date().getTime() < 0;
		},
		quote(state) {
			return state.randomQuote.quote;
		},
		author(state) {
			return state.randomQuote.author;
		}
	},

	mutations: {
		setQuote: (state, { quote, author, expires }) => {
			state.randomQuote = { quote, author };
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
		/*async getQuoteFromServer({ rootGetters, commit, dispatch }, commitOnFail) {
			try {
				commit('setQuoteLoaded', false);
				let url = quoteApi.url.get(rootGetters.quoteCategory);
				let data = await quoteApi.request(url);
				dispatch('quoteSetFromApi', data);
			}
			catch (e) {
				if (commitOnFail) {
					console.warn("Error in getting quote from server. However, old date will be committed now. ", e);
					dispatch('quoteSetFromStorage', commitOnFail);
				} else {
					console.warn("Error in getting quote from server.", e);
				}
			}
		},
		storageLoadFail({ dispatch }) {
			dispatch('getQuoteFromServer');
		},
		storageLoadExpired({ dispatch }, data) {
			//should commit data if getting from server fails
			dispatch('getQuoteFromServer', data);
		},
		storageLoadSuccess({ commit, dispatch }, localData) {
			const { randomQuote, expires } = localData;
			if (expires - new Date().getTime() < 0) return dispatch('storageLoadExpired', localData);
			commit('setQuote', { randomQuote, expires });
		},
		quoteSetFromApi({ commit }, apiData) {
			const { data: randomQuote, expires } = apiData;
			commit('setQuote', { randomQuote, expires });
		},*/
		quoteSettingsChanged({ getters, dispatch }) {
			const currentQuoteData = getters.quoteWatch;
			dispatch('getQuoteFromServer', currentQuoteData);
		},


		/*
		Initializing sequence:
			StorageLoadSuccess => set local data to store
			StorageLoadFail => fetchApiData

			SetLocalDataToStore, fresh => finishedLoading = true, dataStatus = "fresh"
			SetLocalDataToStore, stale => dataStatus = "stale" => fetchApiData

			FetchApiData success => set api data to store => finishedLoading = true, dataStatus = "fresh"
			FetchApiData fail => finishedLoading = true

			SetApiDataToStore => finishedLoading = true, dataStatus = "fresh"
		*/

		async storageLoadFail({ commit, dispatch }) {
			debugger;
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
			commit('setQuote', localData);
		},
		setApiData({commit}, apiData) {
			commit('setQuote', apiData);
			commit('setDataStatus', "fresh");
		},
		async fetchApiData({dispatch}) {
			try {
				let apiData = await dispatch('apiRequest');
				dispatch('setApiData', {
					expires: apiData.expires,
					quote: apiData.data.quote,
					author: apiData.data.author
				});
			} catch (e) {
				console.warn("Could not load quote api data...");
				console.warn(e);
			}			
		},
		async apiRequest({rootGetters}) {
			let url = quoteApi.url.get(rootGetters.quoteCategory);
			return quoteApi.request(url);
		}
	}

}

export default quoteStore;