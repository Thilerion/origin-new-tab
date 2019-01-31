import { quoteRequest as apiRequest } from '../api/';

import { storeMixins } from '../../widgets/base/store/mixins';
const externalApiMixin = storeMixins.externalAPI(validateData, fetchApiData);

import { createWidgetModule } from '../../widgets/base/store/index.js';

const widgetName = "quote";

async function fetchApiData({getters, dispatch}) {
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
};

function validateData(state) {
	if (state.finishedLoading) return false;

	if (!state.expires) return true;
	if (typeof state.data.quote !== "string") return true;
	if (typeof state.data.author !== "string") return true;
	if (state.data.quote.length < 1) return true;
	if (state.data.author.length < 1) return true;
}

const widgetModuleBase = {
	namespaced: true,

	state: {
		data: {
			quote: "",
			author: ""
		}
	},

	getters: {
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

const composedQuoteStoreModule = createWidgetModule({
	mixins: [externalApiMixin],
	widgetOptions: widgetModuleBase
});

console.log(composedQuoteStoreModule);

export default composedQuoteStoreModule;