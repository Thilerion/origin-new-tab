import {quoteRequest as apiRequest} from '../api/';

const quoteStore = {
	namespaced: true,

	state: {
		quote: "",
		author: "",
		expires: null,
		finishedLoading: false,		//true, false
		dataStatus: null			//fresh, stale, null
	},

	getters: {
		// COMMMON GETTERS
		toWatch(state) {
			const { quote, author, expires } = state;
			return { quote, author, expires };
		},
		hasExpired(state) {
			return state.expires - new Date().getTime() < 0;
		},

		dataInvalid(state) {
			if (state.finishedLoading) return false;

			if (!state.expires) return true;
			if (typeof state.quote !== "string") return true;
			if (typeof state.author !== "string") return true;
			if (state.quote.length < 1) return true;
			if (state.author.length < 1) return true;
		},

		// UNIQUE GETTERS
		quote(state) {
			return state.quote;
		},
		author(state) {
			return state.author;
		},
		category({ }, { }, { }, rootGetters) {
			return rootGetters.quoteCategory;
		}
	},

	mutations: {
		// COMMON MUTATIONS
		setData(state, { quote, author, expires }) {
			state.quote = quote;
			state.author = author;
			state.expires = expires;
		},
		setFinishedLoading(state, bool) {
			state.finishedLoading = !!bool;
		},
		setDataStatus(state, status) {
			state.dataStatus = status;
		},
		setExpiresToNow(state) {
			state.expires = new Date().getTime();
		}
	},

	actions: {
		// COMMON ACTIONS
		settingsChanged({ dispatch }) {
			dispatch('getNewQuote');
		},
		async storageLoadFail({ commit, dispatch }) {
			await dispatch('fetchApiData');
			commit('setFinishedLoading', true);
		},
		async storageLoadSuccess({ getters, commit, dispatch }, localData) {
			dispatch('setLocalData', localData);
			if (getters.hasExpired || getters.dataInvalid) {
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
		async fetchApiData({getters, dispatch}) {
			try {
				const category = getters.category;
				let apiData = await apiRequest({category});
				dispatch('setApiData', {
					expires: apiData.expires,
					quote: apiData.data.quote,
					author: apiData.data.author
				});
			} catch (e) {
				console.warn("Could not load QUOTE api data...");
				console.warn(e);
			}			
		},

		// UNIQUE ACTIONS
		async getNewQuote({commit, dispatch}) {
			commit('setDataStatus', "stale");
			commit('setExpiresToNow');
			commit('setFinishedLoading', false);
			await dispatch('fetchApiData');
			commit('setFinishedLoading', true);
		}
	}

}

export default quoteStore;