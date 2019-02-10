import {
	createBaseState,
	createBaseGetters,
	createBaseMutations,
	createBaseActions
} from '../common/base-store.js';

import {
	mergeStoreData,
	createWidgetStore
} from '@/utils/createWidgetStore';

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
const mergedData = mergeStoreData(storeDataDefaults, STORAGE_KEY);

const baseState = createBaseState({
	data: mergedData
});
const baseGetters = createBaseGetters({
	apiRequestParams(state, getters, rState) {
		const collection = rState.settings.unsplash.collection;
		const lang = rState.settings.general.language;
		return [
			'unsplash',
			`/wallpapers/${collection}`,
			{ lang }
		];
	},
	hasLocalStorageData(state) {
		return state.data.wallpapers.length > 0;
	}
});
const baseMutations = createBaseMutations({
	setData(state, arr) {
		state.data.wallpapers = [...arr];
		state.data.lastArrayChange = Date.now();
	}
});
const baseActions = createBaseActions({
	finishInit({ dispatch, commit }, success) {		
		// Check if refreshInterval has passed since lastCurrentIdxChange, if next wallpaper should be loaded
		dispatch('checkRefreshInterval');

		commit('setDataHasLoaded', !!success);
		commit('setFinishedLoading', true);
	},
	setApiData({ commit }, { data, expires }) {
		commit('setData', data);
		commit('setExpires', expires);

		commit('setCurrentIdx', 0);
		commit('setLastArrayChangeAmount', data.length);

		commit('setFinishedLoading', true);
		commit('setDataHasLoaded', true);
	},
});

const baseStore = {
	namespaced: true,
	state: {
		...baseState
	},
	getters: {
		...baseGetters,
		refreshInterval(state, getters, rState) {
			return rState.settings.unsplash.refreshInterval;
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
		}
	},
	mutations: {
		...baseMutations,
		setCurrentIdx(state, idx) {
			state.data.currentIdx = idx;
			state.data.lastCurrentIdxChange = Date.now();
		},
		setLastArrayChangeAmount(state, amount) {
			state.data.lastArrayChangeAmount = amount;
		},
	},

	actions: {
		...baseActions,
		checkRefreshInterval({state, getters, dispatch}) {
			const refreshInterval = getters.refreshInterval;
			const lastChange = state.data.lastCurrentIdxChange;

			if (Date.now() - lastChange > refreshInterval) {
				dispatch('goToNextWallpaper');
			}
		},
		goToNextWallpaper({ getters, commit }) {
			const idx = getters.nextWallpaperIdx;
			commit('setCurrentIdx', idx);
		}
	}
}

const { register, persist } = createWidgetStore(
	baseStore,
	mergedData,
	STORE_NAME,
	STORAGE_KEY,
	(state) => ({ data: state[STORE_NAME].data, expires: state[STORE_NAME].expires })
);

export { register, persist };