import {quoteRequest as apiRequest} from '../api/';

const quoteStore = {
	namespaced: true,

	state: {
		data: {
			quote: "",
			author: ""
		},

		expires: null,

		finishedLoading: false,		//true, false
		dataStatus: null			//fresh, stale, null
	},

	getters: {

		toWatch: state => ({ data: state.data, expires: state.expires }),
		hasExpired: state => (state.expires - Date.now() < 0),
		
		dataLoadSuccessful: state => state.dataStatus != null && state.finishedLoading,
		dataLoadFailed: state => state.dataStatus === null && state.finishedLoading,


		// TODO: specific function that returns true if the current state.data is not valid
		/*
		dataInvalid: state => {
			specific function here
		},
		*/
		dataInvalid(state) {
			if (state.finishedLoading) return false;

			if (!state.expires) return true;
			if (typeof state.data.quote !== "string") return true;
			if (typeof state.data.author !== "string") return true;
			if (state.data.quote.length < 1) return true;
			if (state.data.author.length < 1) return true;
		},

		// UNIQUE GETTERS
		quote(state) {
			return state.data.quote;
		},
		author(state) {
			return state.data.author;
		},
		category({ }, { }, { }, rootGetters) {
			return rootGetters.quoteCategory;
		}
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
		},

		// UNIQUE MUTATIONS
		// TODO: maybe a "can be reset"-mixin?
		setExpiresToNow(state) {
			state.expires = new Date().getTime();
		}
	},

	actions: {
		settingsChanged({ dispatch }) {
			console.log(`Settings for "${widgetName}"-module changed.`);
			dispatch('getNewQuote');
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
		setLocalData({commit}, data) {
			commit('setData', data);
		},
		setApiData({commit}, apiData) {
			commit('setData', apiData);
			commit('setDataStatus', "fresh");
		},
		async fetchApiData({getters, dispatch}) {
			try {
				// TODO: this is specific to this api needed args
				const category = getters.category;

				let apiData = await apiRequest({category});
				dispatch('setApiData', {
					expires: apiData.expires,
					data: apiData.data
				});
			} catch (e) {
				console.warn(`Could not load ${widgetName.toUpperCase()} api data...`);
				console.warn(e);
			}			
		},

		// UNIQUE ACTIONS
		// TODO: maybe a "can be reset"-mixin?
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