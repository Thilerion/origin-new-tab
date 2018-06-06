import widgetsApi from './api/index';
const wallpaperApi = widgetsApi.wallpaper;

import { deepClone } from '@/utils/deepObject';

const WALLPAPER_CYCLE_TIMEOUT = 1 * 60 * 60 * 1000; //1 uur

const wallpaperStore = {

	state: {
		defaultWallpaper: {
			url: require('@/assets/wallpaper/default_wallpaper.jpg'),
			urlUser: "https://unsplash.com/@goodvybesdaily",
			user: "mike anderson",
			location: "Ganekogorta, Spain",
			urlDownload: require('@/assets/wallpaper/default_wallpaper.jpg'),
			urlRaw: require('@/assets/wallpaper/default_wallpaper.jpg')
		},
		dataLoaded: null,
		wallpaperLoaded: null,
		wallpaperData: {
			wallpapers: [],
			currentWallpaperId: 0,
			collection: 1457745,
			expires: null,
			currentWallpaperSet: null
		}
	},

	getters: {
		wallpaperWatch(state) {
			//Used for the watchers, for syncing with localStorage
			return state.wallpaperData;
		},

		apiDataLoaded: state => state.dataLoaded,
		wallpaperImageLoaded: state => state.wallpaperLoaded,

		//TODO: what if a new wallpaper is being loaded?
		showExternalWallpaper(state) {
			//if DataLoaded (storage or server) && image load success
			return state.dataLoaded && state.wallpaperLoaded;
		},
		showDefaultWallpaper(state) {
			//if DataLoaded === false (no external wallpaper to show)
			//or if DataLoaded === true, but Image Load failed
			return state.dataLoaded === false || state.wallpaperLoaded === false;
		},

		wallpaperToShow(state, getters) {
			const wpExternal = state.wallpaperData.wallpapers[state.wallpaperData.currentWallpaperId];
			const wpDefault = state.defaultWallpaper;

			if (getters.showExternalWallpaper) return wpExternal;
			else if (getters.showDefaultWallpaper) return wpDefault;
			return null;
		},

		currentWallpaperId: state => state.wallpaperData.currentWallpaperId,
		currentExternalWallpaper: (state, getters) => state.wallpaperData.wallpapers[getters.currentWallpaperId] || null,
		wallpaperCollection: state => state.wallpaperData.collection,

		//TODO: LEGACY GETTERS BELOW
		nextWallpaperId(state, getters) {
			const l = state.wallpaperData.wallpapers.length;
			if (l === 0) return 0;
			return (getters.currentWallpaperId + 1) % l;
		},
		nextWallpaperUrl: (state, getters) => {
			if (getters.showExternalWallpaper) return state.wallpaperData.wallpapers[getters.nextWallpaperId].url;
			else return "";
		},
		currentWallpaperSet: state => state.wallpaperData.currentWallpaperSet
	},

	mutations: {
		setDataLoaded(state, loaded) {
			state.dataLoaded = !!loaded;
		},
		setWallpaperImageLoaded(state, loaded) {
			state.wallpaperLoaded = !!loaded;
		},
		setWallpapers(state, wps) {
			//TODO: maybe spread for reactivity??
			state.wallpaperData.wps = deepClone(wps);
		},
		setCurrentWallpaperId(state, id = 0) {
			state.wallpaperData.currentWallpaperId = id;
		},
		setWallpaperCollection(state, collection) {
			state.wallpaperData.collection = collection;
		},
		setWallpaperDataExpires(state, expiresOn) {
			state.wallpaperData.expires = expiresOn;
		},
		setWallpaperLastSet(state, lastSet) {
			state.wallpaperData.lastSet = lastSet;
		},
		goToNextWallpaper(state) {
			if (!state.dataLoaded) {
				console.warn("No wallpaper data is loaded, so can't go to next.");
				return;
			}
			const wpAmount = state.wallpaperData.wallpapers.length;
			const currentId = state.wallpaperData.currentWallpaperId;
			state.wallpaperData.currentWallpaperId = (currentId + 1) % wpAmount;
		},
		hideWallpaper(state) {
			//TODO: this would be easier as actions
			const arrayLength = state.wallpaperData.wallpapers.length;
			const currentId = state.wallpaperData.currentWallpaperId;

			if (!state.dataLoaded) {
				console.warn("No wallpaper data is loaded, so can't hide one.");
			} else if (arrayLength <= 1) {
				console.warn("Can't hide if only 1 wallpaper is left.");
			} else if ((currentId + 1) === arrayLength) {
				console.warn("Viewing last wallpaper currently. Going to next wallpaper, and then removing the last wallpaper.");
				state.wallpaperData.currentWallpaperId = 0;
				state.wallpaperData.splice(-1);
			} else {
				state.wallpaperData.splice(currentId, 1);
			}
		}
	},

	actions: {
		async getWallpapersFromServer({ getters, commit, dispatch }, commitOnFail) {
			try {
				let url = wallpaperApi.url.get(getters.wallpaperCollection);			
				let data = await wallpaperApi.request(url);				
				dispatch('wallpaperSetFromApi', data);
			}
			catch (e) {
				if (commitOnFail) {
					console.warn("Error in getting wallpapers from server. However, old date will be committed now. ", e);					
					dispatch('wallpaperSetFromStorage', commitOnFail);
				} else {
					console.warn("Error in getting wallpapers from server.", e);					
					commit('setWallpaperLoadFailure');					
				}
			}
		},
		wallpaperStorageLoadFailed({dispatch}) {
			dispatch('getWallpapersFromServer');
		},
		wallpaperStorageLoadExpired({dispatch}, data) {
			dispatch('getWallpapersFromServer', data);
		},
		wallpaperSetFromStorage({commit}, localData) {
			const { wallpapers = [], expires, currentWallpaperId = 0, collection, lastSet } = localData;
			const commitData = { wallpapers, expires, currentWallpaperId, collection };
			commit('setWallpaperData', commitData);
			if (lastSet && new Date().getTime() - lastSet > WALLPAPER_CYCLE_TIMEOUT) {
				console.warn(`${WALLPAPER_CYCLE_TIMEOUT / 1000 / 60} minutes have passed since last time wallpaper has changed. Setting next wallpaper now.`);
				commit('nextWallpaper');
			} else {
				commit('setWallpaperLastSet', lastSet);
			}			
			commit('setWallpaperLoaded');			
		},
		wallpaperSetFromApi({ commit }, apiData) {
			const { data: wallpapers = [], expires } = apiData;
			commit('setWallpapers', wallpapers);
			commit('setWallpaperExpires', expires);
			commit('setCurrentWallpaperId', Math.floor(Math.random() * wallpapers.length));
			commit('setWallpaperLoaded');
		},
		setWallpaperCollection({ commit, dispatch }, col) {
			commit('setReloadingWallpapers', true);
			commit('setWallpaperLoadFailure', false);
			commit('setWallpaperLoaded', false);
			commit('setCollection', col);
			dispatch('getWallpapersFromServer');
			commit('setReloadingWallpapers', false);
		}
	}

}

export default wallpaperStore;