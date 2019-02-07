import { ApiRequest } from '../common/api.service.js';
import { mergeStoreData, createWidgetStore } from '@/utils/createWidgetStore';

const STORE_NAME = 'unsplash';
const STORAGE_KEY = 'sp_unsplash';

const storeDataDefaults = {
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
};

const baseStore = {
	namespaced: true,
	state: {
		data: {},
		expires: null,

		finishedLoading: false,
		dataHasLoaded: false
	},
	getters: {
		hasExpired: state => (state.expires - Date.now() < 0),

		refreshInterval(state, getters, rState) {
			return rState.settings.unsplash.refreshInterval;
		},

		apiRequestParams(state, getters, rState) {
			const collection = rState.settings.unsplash.collection;
			const lang = rState.settings.general.language;
			return [
				'unsplash',
				`/wallpapers/${collection}`,
				{ lang }
			];
		},

		currentWallpaper: state => {
			if (state.data.wallpapers.length) {
				return state.data.wallpapers[state.data.currentIdx];
			}			
		},
		nextWallpaperIdx: state => {
			const n = state.data.wallpapers.length;
			if (!n) return;

			const curIdx = state.data.currentIdx;
			return (curIdx + 1) % n;
		},
		nextWallpaper: (state, getters) => {
			const nextIdx = getters.nextWallpaperIdx;
			if (nextIdx == null) return;
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
		checkRefreshInterval({state, getters, dispatch}) {
			const refreshInterval = getters.refreshInterval;
			const lastChange = state.data.lastCurrentIdxChange;

			if (Date.now() - lastChange > refreshInterval) {
				console.log(`[UnsplashStore]: refresh interval has passed (${Date.now() - lastChange} > ${refreshInterval}). Loading next wallpaper now.`);
				dispatch('goToNextWallpaper');
			}
		},

		goToNextWallpaper({ getters, commit }) {
			const idx = getters.nextWallpaperIdx;
			commit('setCurrentIdx', idx);
		},

		setApiData({ commit }, { data, expires }) {
			commit('setWallpapers', data);
			commit('setExpires', expires);

			commit('setCurrentIdx', 0);
			commit('setLastArrayChangeAmount', data.length);

			commit('setFinishedLoading', true);
			commit('setDataHasLoaded', true);
		},

		makeRequest({ getters }) {
			return ApiRequest(...getters.apiRequestParams);
		},

		async fetchApiData({ dispatch }) {
			try {
				const response = await dispatch('makeRequest');
				const { data, expires } = response;
				dispatch('setApiData', { data, expires });
				return true;
			} catch (e) {
				// fetching was not successful
				return false;
			}
		},

		/**
		 * Called by component, initiating a fetch or not
		 */
		async init({ state, getters, commit, dispatch }) {
			let hasFetched;
			let hasData;

			const hasLocalStorageData = state.data.wallpapers.length > 0;

			const expired = getters.hasExpired;
			if (hasLocalStorageData) {
				if (expired) {
					console.warn("Has local storage, but expired.");
					// fetch data, but use current if it fails
					hasFetched = await dispatch('fetchApiData');
				} else if (!expired) {
					console.warn("Has local storage, and data fresh.");
					hasFetched = true;
				}
				hasData = true;
			} else if (!hasLocalStorageData) {
				// try to fetch, no fallback possible
				console.warn("No local storage data");
				hasFetched = await dispatch('fetchApiData');
				if (hasFetched) {
					hasData = true;
				} else {
					hasData = false;
				}
			}

			dispatch('finishInit', await hasData);
		},

		/**
		 * Called by init() action, to set the finishedLoading and dataHasLoaded things
		 */
		finishInit({ dispatch, commit }, success) {
			console.warn("Finishing init with hasData as: ", success);
			
			// Check if refreshInterval has passed since lastCurrentIdxChange, if next wallpaper should be loaded
			dispatch('checkRefreshInterval');

			commit('setDataHasLoaded', !!success);
			commit('setFinishedLoading', true);
		}
	}
}

const mergedData = mergeStoreData(storeDataDefaults, STORAGE_KEY);
const { register, persist } = createWidgetStore(
	baseStore,
	mergedData,
	STORE_NAME,
	STORAGE_KEY,
	(state) => ({ data: state[STORE_NAME].data, expires: state[STORE_NAME].expires })
);

export { register, persist };