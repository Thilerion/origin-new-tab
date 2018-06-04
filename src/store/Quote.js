import widgetsApi from './api/index';
const quoteApi = widgetsApi.quote;

const quoteStore = {

	state: {
		quoteData: {
			randomQuote: {},
			expires: null
		}
	},

	getters: {
		quoteWatch: state => state.quoteData,
		quoteLoaded: state => (state.quoteData.randomQuote.quote && state.quoteData.randomQuote.author)
	},

	mutations: {
		setQuote: (state, { randomQuote, expires }) => {
			state.quoteData.randomQuote = { ...randomQuote };
			state.quoteData.expires = expires;
		}
	},

	actions: {
		async getQuoteFromServer({dispatch}) {
			try {
				let url = quoteApi.url.get();				
				let data = await quoteApi.request(url);				
				console.log("Data from quote actions 'getFromServer': ", data);
				dispatch('quoteSetFromApi', data);
			}
			catch (e) {
				console.warn("ERROR IN GETTER FROM SERVER: ", e);
			}
		},
		quoteStorageLoadFailed({ dispatch }) {
			dispatch('getQuoteFromServer');
		},
		quoteStorageLoadExpired({ dispatch }, data) {
			//should commit data if getting from server fails
			dispatch('getQuoteFromServer');
		},
		quoteSetFromStorage({ commit }, localData) {
			const { randomQuote, expires } = localData;
			commit('setQuote', { randomQuote, expires });
		},
		quoteSetFromApi({ commit }, apiData) {
			const { data: randomQuote, expires } = apiData;
			commit('setQuote', { randomQuote, expires });
		}
	}

}

export default quoteStore;