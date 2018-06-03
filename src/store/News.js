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
		setNewNewsArticles(state, data) {
			state.newsData.articles = data.articles;
			state.newsData.lastRetrieved = new Date().getTime();
		},
		setNewsArticles(state, data) {
			state.newsData.articles = data.articles;
			state.newsData.lastRetrieved = data.lastRetrieved;
		}
	},

	actions: {
		newsLoadFailed({dispatch}) {
			console.warn("News load failed");
			dispatch('getNewsFromServer');
		},
		newsSet({state, commit, dispatch}, data) {
			const newsDataAge = new Date().getTime() - data.lastRetrieved;

			let dur = new Date(newsDataAge).toISOString().substr(11, 8);
			console.warn("Age of news data: ", dur);

			if (newsDataAge > NEWS_EXP) {
				dispatch('getNewsFromServer');
				console.warn("News was outdated. Getting new news from server");
			} else {
				commit('setNewsArticles', data);
			}			
		},
		async getNewsFromServer({ commit, dispatch }) {
			try {
				let res = await axios.get(`${API_URL}/news`);
				let data = res.data.data;
				
				if (res.data.success) {
					commit('setNewNewsArticles', data);
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