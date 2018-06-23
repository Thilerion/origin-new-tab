import widgetsApi from '../api';
const newsApi = widgetsApi.news;

const newsStore = {
	namespaced: true,

	state: {
		expires: null,
		articles: [],
		dataLoaded: false
	},

	getters: {
		newsWatch(state) {
			const { expires, articles } = state;
			return { expires, articles };
		}
	},

	mutations: {
		setNewsArticles(state, {articles, expires}) {
			state.articles = [...articles];
			state.expires = expires;
			state.dataLoaded = true;
		}
	},

	actions: {
		async getNewsFromServer({ dispatch }, commitOnFail) {
			try {
				let url = newsApi.url.get();				
				let data = await newsApi.request(url);				
				dispatch('newsSetFromApi', data);
			}
			catch (e) {
				if (commitOnFail) {
					console.warn("Error in getting news from server. However, old date will be committed now. ", e);
					dispatch('newsSetFromStorage', commitOnFail);
				} else {
					console.warn("Error in getting news from server. ", e);
				}
			}
		},
		newsStorageLoadFailed({ dispatch }) {
			dispatch('getNewsFromServer');
		},
		newsStorageLoadExpired({ dispatch }, data) {
			//should commit data if getting from server fails
			dispatch('getNewsFromServer', data);					
		},
		newsSetFromStorage({ commit }, localData) {
			const { articles = [], expires } = localData;
			commit('setNewsArticles', { articles, expires });
		},
		newsSetFromApi({ commit }, apiData) {
			const { data: articles = [], expires } = apiData;
			commit('setNewsArticles', { articles, expires });
		}
	}

}

export default newsStore;