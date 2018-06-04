import widgetsApi from './api/index';
const newsApi = widgetsApi.news;

const newsStore = {

	state: {
		newsData: {
			expires: null,
			articles: []
		}
	},

	getters: {
		newsWatch: state => state.newsData,
		newsArticles: state => state.newsData.articles
	},

	mutations: {
		setNewsArticles(state, {articles, expires}) {
			state.newsData.articles = [...articles];
			state.newsData.expires = expires;
		}
	},

	actions: {
		async getNewsFromServer({ dispatch }) {
			try {
				let url = newsApi.url.get();				
				let data = await newsApi.request(url);				
				console.log("Data from news actions 'getFromServer': ", data);
				dispatch('newsSetFromApi', data);
			}
			catch (e) {
				console.warn("ERROR IN GETTER FROM SERVER: ", e);
			}
		},
		newsStorageLoadFailed({ dispatch }) {
			dispatch('getNewsFromServer');
		},
		newsStorageLoadExpired({ dispatch }, data) {
			//should commit data if getting from server fails
			dispatch('getNewsFromServer');					
		},
		newsSetFromStorage({ commit }, localData) {
			const { articles = [], expires } = localData;
			commit('setNewsArticles', { articles, expires });
		},
		newsSetFromApi({ commit }, apiData) {
			const { data: articles = [], expires } = apiData;
			console.log("Articles, expires, apiData (from news)");
			console.log(articles, expires, apiData);
			commit('setNewsArticles', { articles, expires });
		}
	}

}

export default newsStore;