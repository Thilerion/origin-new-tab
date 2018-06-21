import widgetsApi from './api/index';
const quoteApi = widgetsApi.quote;

import { defaultSettings } from './defaultUserSettings';

const quoteStore = {

	state: {
		quoteData: {
			randomQuote: {},
			expires: null,
		},
		dataLoaded: false
	},

	getters: {
		quoteWatch: state => state.quoteData,
		quoteDataLoaded: state => state.dataLoaded
	},

	mutations: {
		setQuote: (state, { randomQuote, expires }) => {
			state.quoteData.randomQuote = { ...randomQuote };
			state.quoteData.expires = expires;
			state.dataLoaded = true;
		},
	},

	actions: {
		async getQuoteFromServer({getters, dispatch}, commitOnFail) {
			try {
				let url = quoteApi.url.get(getters.quoteCategory);				
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
			const { randomQuote, expires, quoteCategory = 'motivinspirational' } = localData;
			commit('setQuote', { randomQuote, expires });
			commit('setQuoteCategory', quoteCategory);
		},
		quoteSetFromApi({ commit }, apiData) {
			const { data: randomQuote, expires } = apiData;
			commit('setQuote', { randomQuote, expires });
		}
	}

}

export default quoteStore;