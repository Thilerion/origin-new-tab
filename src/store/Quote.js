import widgetsApi from './api/index';
const quoteApi = widgetsApi.quote;

const quoteStore = {

	state: {
		quoteData: {
			randomQuote: {},
			expires: null
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
		}
	},

	actions: {
		async getQuoteFromServer({dispatch}, commitOnFail) {
			try {
				let url = quoteApi.url.get();				
				let data = await quoteApi.request(url);				
				console.log("Data from quote actions 'getFromServer': ", data);
				dispatch('quoteSetFromApi', data);
			}
			catch (e) {
				console.warn("ERROR IN GETTER FROM SERVER: ", e);
				if (commitOnFail) {
					console.warn("However, data was found in storage (although outdated) which will now be committed.");
					dispatch('quoteSetFromStorage', commitOnFail);
				} else {
					console.warn("Also, no data was found in localStorage.");
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
		}
	}

}

export default quoteStore;