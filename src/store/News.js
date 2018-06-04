import axios from 'axios';
import API_URL from './api/config.api';

const NEWS_EXP = 2 * 60 * 60 * 1000; //2 uur

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
		setNewsArticles(state, data) {
			state.newsData.articles = data.articles;
		}
	},

	actions: {
		async getNewsFromServer({ commit, dispatch }) {
			try {
				let res = await axios.get(`${API_URL}/news`);
				let data = res.data.data;
				
				if (res.data.success) {
					commit('setNewsArticles', data);
				} else {
					throw new Error('failed loading news from server');
				}				
			}
			catch (e) {
				console.warn(e);
			}
		},
		newsStorageLoadFailed({ dispatch }) {
			dispatch('getNewsFromServer');
		},
		newsStorageLoadExpired({ dispatch }, data) {
			//should commit data if getting from server fails
			dispatch('getNewsFromServer');					
		},
		newsSet({ commit }, data) {
			commit('setNewsArticles', data);
		}
	}

}

export default newsStore;