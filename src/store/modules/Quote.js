import widgetsApi from '../api';
const quoteApi = widgetsApi.quote;

const quoteStore = {
	namespaced: true,

	state: {
		randomQuote: {},
		expires: null,
		dataLoaded: false
	},

	getters: {
		quoteWatch(state) {
			const { randomQuote, expires } = state;
			return { randomQuote, expires };
		},
		quote(state) {
			return state.randomQuote.quote;
		},
		author(state) {
			return state.randomQuote.author;
		}
	},

	mutations: {
		setQuote: (state, { randomQuote, expires }) => {
			state.randomQuote = { ...randomQuote };
			state.expires = expires;
			state.dataLoaded = true;
		},
		setQuoteLoaded(state, bool) {
			if (bool == null) state.dataLoaded = !state.dataLoaded;
			else state.dataLoaded = bool;
		}
	},

	actions: {
		async getQuoteFromServer({rootGetters, commit, dispatch}, commitOnFail) {
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
		quoteStorageLoadFailed({ dispatch }) {
			dispatch('getQuoteFromServer');
		},
		quoteStorageLoadExpired({ dispatch }, data) {
			//should commit data if getting from server fails
			dispatch('getQuoteFromServer', data);
		},
		quoteSetFromStorage({ commit }, localData) {
			const { randomQuote, expires } = localData;
			commit('setQuote', { randomQuote, expires });
		},
		quoteSetFromApi({ commit }, apiData) {
			const { data: randomQuote, expires } = apiData;
			commit('setQuote', { randomQuote, expires });
		},
		quoteSettingsChanged({getters, dispatch}) {
			const currentQuoteData = getters.quoteWatch;
			dispatch('getQuoteFromServer', currentQuoteData);
		}
	}

}

export default quoteStore;