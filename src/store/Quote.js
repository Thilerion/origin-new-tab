import axios from 'axios';

// const QUOTE_EXP = 6 * 60 * 60 * 1000; //6 uur
const QUOTE_EXP = 40000;

const quoteStore = {

	state: {
		quoteData: {
			randomQuote: [],
			dateRetrieved: null
		}
	},

	getters: {
		quoteWatch: state => state.quoteData,
		quoteLoaded: state => state.quoteData.randomQuote.length === 2
	},

	mutations: {
		setQuote: (state, q) => state.quoteData = q
	},

	actions: {
		quoteSet({ commit, dispatch }, quoteData) {
			if (quoteData && quoteData.randomQuote && quoteData.dateRetrieved) {
				let timeSinceQuote = new Date().getTime() - quoteData.dateRetrieved;
				if (timeSinceQuote > QUOTE_EXP) dispatch('quoteLoadFailed');
				else commit('setQuote', quoteData);
			} else {
				dispatch('quoteLoadFailed');
			}
		},
		quoteLoadFailed({ commit, dispatch }) {
			dispatch('getQuoteFromServer');
		},
		async getQuoteFromServer({commit}) {
			try {
				let res = await axios.get(`http://localhost:3000/quote`);
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
		}
	}

}

export default quoteStore;