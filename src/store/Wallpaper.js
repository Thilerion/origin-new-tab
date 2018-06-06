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

		nextWallpaperId(state, getters) {
			const l = state.wallpaperData.wallpapers.length;
			if (l === 0) return 0;
			return (getters.currentWallpaperId + 1) % l;
		},
		nextWallpaperUrl: (state, getters) => {
			return state.wallpaperData.wallpapers[getters.nextWallpaperId].url;
		},
		currentWallpaperSet: state => state.wallpaperData.currentWallpaperSet
	},

	mutations: {
		setDataLoaded(state, loaded) {
			state.dataLoaded = !!loaded;
		},
		setWallpaperImageLoaded(state, loaded) {
			state.wallpaperLoaded = loaded;
		},
		setWallpapers(state, wps) {
			//TODO: maybe spread for reactivity??
			state.wallpaperData.wallpapers = deepClone(wps);
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
		removeWallpaperFromArray(state, index) {
			state.wallpaperData.wallpapers.splice(index, 1);
		}
	},

	actions: {
		getWallpapersFromServer({ getters, commit, dispatch }, commitOnFail) {
			let url = wallpaperApi.url.get(getters.wallpaperCollection);
			wallpaperApi.request(url)
				.then(data => {
					console.log("Got data from wallpaper API!");
					dispatch('wallpaperSetFromApi', data);
				})
				.catch(err => {
					if (commitOnFail) {
						console.warn("Error in retrieving data from server (wallpaper), so committing stale data to store.")
						dispatch('wallpaperSetFromStorage', commitOnFail);
					} else {
						console.warn("Error in retrieving data from server (wallpaper).");
						dispatch('loadingDataFailed');
					}
				});
		},

		wallpaperStorageLoadFailed({dispatch}) {
			dispatch('getWallpapersFromServer');
		},

		wallpaperStorageLoadExpired({dispatch}, data) {
			dispatch('getWallpapersFromServer', data);
		},

		wallpaperSetFromStorage({ commit, dispatch }, localData) {
			const {
				wallpapers = [],
				expires,
				currentWallpaperId = 0,
				collection,
				lastSet = new Date().getTime()
			} = localData;

			//TODO: refresh to next wallpaper if lastSet is too long ago
			commit('setWallpapers', wallpapers);
			commit('setCurrentWallpaperId', currentWallpaperId);
			commit('setWallpaperCollection', collection);
			commit('setWallpaperDataExpires', expires);
			commit('setWallpaperLastSet', lastSet);

			dispatch('loadingDataSucces');
		},

		wallpaperSetFromApi({ commit, dispatch }, apiData) {
			const {
				data: wallpapers = [],
				expires
			} = apiData;

			commit('setWallpapers', wallpapers);
			commit('setWallpaperDataExpires', expires);
			commit('setCurrentWallpaperId', Math.floor(Math.random() * wallpapers.length));

			dispatch('loadingDataSucces');			
		},

		goToNextWallpaper({ state, getters, commit, dispatch }) {
			if (!state.dataLoaded) {
				console.warn("No wallpaper data is loaded, so can't go to next.");
				return;
			}
			//TODO: some sort of action that loads an image, and than tells the store it is loaded and can be displayed
			dispatch('loadImageSource', getters.nextWallpaperUrl)
				.then(() => {
					commit('setCurrentWallpaperId', getters.nextWallpaperId);
					commit('setWallpaperImageLoaded', true)
				})
				.catch(e => {
					console.warn(e);
				});
		},

		hideCurrentWallpaper({ state, getters, commit }) {
			const arrayLength = state.wallpaperData.wallpapers.length;
			const currentId = state.wallpaperData.currentWallpaperId;
			const nextId = getters.nextWallpaperId;

			if (!state.dataLoaded) {
				console.warn("No wallpaper data is loaded, so can't hide one.");
			} else if (arrayLength <= 1) {
				console.warn("Can't hide if only 1 wallpaper is left.");
			} else {
				if (nextId === 0) {
					console.warn("Viewing last wallpaper currently. Going to next wallpaper, and then removing the last wallpaper.");
					commit('setCurrentWallpaperId', nextId);
				}
				commit('removeWallpaperFromArray', currentId);
			}
		},

		loadingDataFailed({commit}) {
			commit('setDataLoaded', false);
		},

		loadingDataSucces({getters, commit, dispatch}) {
			commit('setDataLoaded', true);
			const url = getters.currentExternalWallpaper.url;
			console.log("URL: ", url);
			dispatch('loadImageSource', url)
				.then(() => {
					commit('setWallpaperImageLoaded', true);
				})
				.catch((err) => {
					console.warn(err);
					commit('setWallpaperImageLoaded', false);
				});
		},

		loadImageSource: ({ }, url) => {
			console.log("URL: ", url);			
			return new Promise((resolve, reject) => {
				const image = new Image();

				let loaded = () => {
					console.log(loadTimer);
					clearTimeout(loadTimer);
					loadTimer = null;
					console.log("IMAGE LOADED!");
					resolve(url);
				}

				function errorLoading() {
					reject('Error loading image');
				}
				function abortedLoading() {
					reject("Loading image aborted");
				}
				function timedOutLoading() {
					reject("Timed out");
				}

				image.addEventListener('load', loaded);
				image.addEventListener('error', errorLoading);
				image.addEventListener('abort', abortedLoading);
				let loadTimer = setTimeout(() => {
					image.removeEventListener('load', loaded);
					image.removeEventListener('error', errorLoading);
					image.removeEventListener('abort', abortedLoading);
					image.src = "";
					timedOutLoading();
				}, 20000);

				image.src = url;
			})
		},

		retryLoadingWallpapers({getters, dispatch}) {
			if (!getters.apiDataLoaded) {
				// if data loading failed
				console.log("Loading wallpaper data was unsuccesful, so retrying that now.");
				dispatch('getWallpapersFromServer');
			} else if (!getters.wallpaperImageLoaded) {
				// if loading the wallpaper itself failed
				console.log("Loading wallpaper data was succesful, so retrying the wallpaper source now.");
				dispatch('loadingDataSucces');
			}			
		},

		//TODO: legacy below this
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