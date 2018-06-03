import axios from 'axios';
import API_URL from './api/config.api';

const NEWS_EXP = 2 * 60 * 60 * 1000; //2 uur

const newsStore = {

	state: {
		newsData: {
			lastRetrieved: null,
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
			state.newsData.lastRetrieved = new Date().getTime();
		}
	},

	actions: {
		newsLoadFailed({dispatch}) {
			console.warn("News load failed");
			dispatch('getNewsFromServer');
		},
		newsSet({commit}, data) {
			//if last retrieved blabla
			commit('setNewsArticles', data);
		},
		async getNewsFromServer({ commit, dispatch }) {
			try {
				let res = await axios.get(`${API_URL}/news`);
				
				if (res.data.success) {
					commit('setNewsArticles', res.data.res);
				} else {
					throw new Error('failed loading news from server');
				}				
			}
			catch (e) {
				console.warn(e);
			}
		}
	}

}

export default newsStore;