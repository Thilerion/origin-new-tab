import axios from 'axios';
import API_URL from './api/config.api';

const QUOTE_EXP = 6 * 60 * 60 * 1000; //6 uur

const quoteStore = {

	state: {
		quoteData: {
			randomQuote: [],
			expires: null
		}
	},

	getters: {
		quoteWatch: state => state.quoteData,
		quoteLoaded: state => (state.quoteData.randomQuote.quote && state.quoteData.randomQuote.author)
	},

	mutations: {
		setQuote: (state, q) => state.quoteData = q
	},

	actions: {
		async getQuoteFromServer({commit}) {
			try {
				let res = await axios.get(`${API_URL}/quote`);
				if (res.data.success) {
					let q = {
						randomQuote: res.data.data,
						dateRetrieved: new Date().getTime()
					};
					commit('setQuote', q);					
				} else {
					throw new Error('failed loading quote');
				}
			}
			catch (e) {
				console.warn(e);
			}
		},
		quoteStorageLoadFailed({ dispatch }) {
			dispatch('getQuoteFromServer');
		},
		quoteStorageLoadExpired({ dispatch }, data) {
			//should commit data if getting from server fails
			dispatch('getQuoteFromServer');
		},
		quoteSet({ commit }, data) {
			commit('setQuote', data);
		}
	}

}

export default quoteStore;