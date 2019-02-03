import { ApiRequest } from '../common/api.service.js';
import _merge from 'lodash.merge';

const unsplashModule = {
	namespaced: true,
	
	state: {
		data: {
			// List of wallpapers retrieved from unsplash
			wallpapers: [],
			// Current wallpaper to show
			currentIdx: 0,
			// List of wallpaper ids that should be hidden
			hiddenIds: [],

			// Last time a new wallpaper was shown (for interval setting)
			lastCurrentIdxChange: null,
			// Last time the wallpapers list was refreshed for the current category
			// Reason is to load new wallpapers from the category if all have been seen
			lastArrayChange: null,
			// Amount of new wallpapers retrieved last time the array was refreshed
			// Reason is to prevent trying to load new wallpapers when there are none
			lastArrayChangeAmount: null
		},

		// When to force-refresh the wallpapers array / data property
		expires: null,

		finishedLoading: false,
		dataHasLoaded: false
	},

	getters: {
		hasExpired: state => (state.expires - Date.now() < 0),

		settings(s, g, rootState) {
			return rootState.settings;
		},

		currentWallpaper: state => {
			if (state.data.wallpapers.length) {
				return state.data.wallpapers[state.data.currentIdx];
			}			
		},
		nextWallpaper: state => {
			const n = state.data.wallpapers.length;
			if (!n) return;

			const curIdx = state.data.currentIdx;
			const nextIdx = (curIdx + 1) % n;
			return state.data.wallpapers[nextIdx];
		},

		showComponent(state) {
			return state.finishedLoading && state.dataHasLoaded;
		},
		errorLoading(state) {
			return state.finishedLoading && !state.dataHasLoaded;
		}
	},

	mutations: {
		setWallpapers(state, arr) {
			state.data.wallpapers = [...arr];
			state.data.lastArrayChange = Date.now();
		},
		setExpires(state, time) {
			state.expires = time;
		},
		setCurrentIdx(state, idx) {
			state.data.currentIdx = idx;
			state.data.lastCurrentIdxChange = Date.now();
		},
		setLastArrayChangeAmount(state, amount) {
			state.data.lastArrayChangeAmount = amount;
		},
		setFinishedLoading(state, bool) {
			state.finishedLoading = bool;
		},
		setDataHasLoaded(state, bool) {
			state.dataHasLoaded = bool;
		}
	},

	actions: {
		fetchApiData({ getters, commit, dispatch }) {
			const collection = getters.settings.unsplash.collection;
			ApiRequest('unsplash', `/wallpapers/${collection}`, {
				lang: getters.settings.general.language
			}).then(({data, expires}) => {
				dispatch('setApiData', { data, expires });
			}).catch(e => {
				commit('setFinishedLoading', true);
				commit('setDataHasLoaded', false);
			})
		},
		setApiData({ commit }, { data, expires }) {
			commit('setWallpapers', data);
			commit('setExpires', expires);

			commit('setCurrentIdx', 0);
			commit('setLastArrayChangeAmount', data.length);

			commit('setFinishedLoading', true);
			commit('setDataHasLoaded', true);
		}
	}
}

export default unsplashModule;