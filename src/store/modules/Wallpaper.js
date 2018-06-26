import {wallpaperRequest as apiRequest} from '../api/';

import { deepClone, uniqueBy } from '@/utils/deepObject';

const wallpaperStore = {
	namespaced: true,

	state: {
		wallpapers: [],
		currentWallpaperId: 0,
		expires: null,
		idLastSet: null,
		arrayUpdated: new Date().getTime(),
		arrayUpdateChangeAmount: null,
		hiddenIds: [],

		defaultWallpaper: {
			url: require('@/assets/wallpaper/default_wallpaper.jpg'),
			urlUser: "https://unsplash.com/@goodvybesdaily",
			user: "mike anderson",
			location: "Ganekogorta, Spain",
			urlDownload: require('@/assets/wallpaper/default_wallpaper.jpg'),
			urlRaw: require('@/assets/wallpaper/default_wallpaper.jpg'),
			id: 0
		},

		finishedLoading: false,
		dataStatus: null,

		loadingImage: false,
		errorLoadingImage: false
	},

	getters: {
		// COMMMON GETTERS
		toWatch(state) {
			const { wallpapers, currentWallpaperId, expires, idLastSet, arrayUpdated, arrayUpdateChangeAmount } = state;
			return { wallpapers, currentWallpaperId, expires, idLastSet, arrayUpdated, arrayUpdateChangeAmount };
		},

		hasExpired(state) {
			return state.expires - new Date().getTime() < 0;
		},

		// UNIQUE GETTERS
		collection({ }, { }, { }, rootGetters) {
			return rootGetters.wallpaperCollection;	
		},
		refreshTime({ }, { }, { }, rootGetters) {
			return rootGetters.wallpaperRefresh;	
		},
		nextWallpaperId(state) {
			return state.wallpapers.length === 0 ? 0 : (state.currentWallpaperId + 1) % state.wallpapers.length;
		},

		dataLoadSuccessful(state) {
			//dataStatus either "fresh" or "stale" and loading is finished
			return state.dataStatus != null && state.finishedLoading;
		},
		dataLoadFailed(state) {
			//this means data could not be loaded
			return state.dataStatus === null && state.finishedLoading;
		},
		showExternal(state, getters) {
			//TODO: AND NO ERROR LOADING IMAGE
			return !!getters.dataLoadSuccessful && !state.errorLoadingImage;
		},
		showDefault(state, getters) {
			//TODO: OR ERROR LOADING IMAGE
			return !!getters.dataLoadFailed || state.errorLoadingImage;
		},
		showAny(state, getters) {
			return getters.showExternal || getters.showDefault;
		},

		currentWallpaper(state, getters) {
			if (getters.showExternal) return state.wallpapers[state.currentWallpaperId];
			else return state.defaultWallpaper;
		},
		nextWallpaper(state, getters) {
			if (getters.dataLoadSuccessful) return state.wallpapers[getters.nextWallpaperId];
			else return null;
		},

		// OLD BELOW
		/*showExternalWallpaper(state) {
			//if DataLoaded (storage or server) && image load success
			return !!state.finishedLoading;
		},
		showDefaultWallpaper(state) {
			//if DataLoaded === false (no external wallpaper to show)
			//or if DataLoaded === true, but Image Load failed
			return state.finishedLoading === false;
		},

		wallpaperToShow(state, getters) {
			const wpExternal = state.wallpapers[state.currentWallpaperId];
			const wpDefault = state.defaultWallpaper;
			if (getters.showExternalWallpaper) return wpExternal;
			else if (getters.showDefaultWallpaper) return wpDefault;
			return null;
		},

		currentExternalWallpaper: state => state.wallpapers[state.currentWallpaperId] || null,

		wallpapersLength: state => state.wallpapers.length || 0,

		nextWallpaperUrl: (state, getters) => {
			if (getters.showDefaultWallpaper) return state.defaultWallpaper.url;
			else if (!state.dataLoaded) return;
			return state.wallpapers[getters.nextWallpaperId].url;
		},*/
		arrayUpdateChangePercentage(state, getters) {
			return state.arrayUpdateChangeAmount / getters.wallpapersLength;
		}
	},

	mutations: {
		// COMMON MUTATIONS
		setData(state, data) {
			let {
				wallpapers,
				expires,
				arrayUpdated,
				arrayUpdateChangeAmount,
				idLastSet,
				currentWallpaperId,
				hiddenIds
			} = data;

			state.expires = expires;
			state.wallpapers = [...wallpapers];

			state.arrayUpdated = arrayUpdated;
			state.arrayUpdateChangeAmount = arrayUpdateChangeAmount;

			state.idLastSet = idLastSet;
			state.currentWallpaperId = currentWallpaperId;

			state.hiddenIds = [...hiddenIds];
		},
		setFinishedLoading(state, bool) {
			state.finishedLoading = !!bool;
		},
		setDataStatus(state, status) {
			state.dataStatus = status;
		},

		// UNIQUE MUTATIONS
		setWallpaperId(state, { currentWallpaperId = 0, idLastSet = new Date().getTime() }) {
			state.currentWallpaperId = currentWallpaperId;
			state.idLastSet = idLastSet;
		},
		setErrorLoadingImage(state, bool) {
			state.errorLoadingImage = bool;
		},
		setCurrentlyLoadingImage(state, bool) {
			// to disable loading a new image when still loading
			state.loadingImage = bool;
		},
		removeWallpaper(state, index) {
			state.wallpapers.splice(index, 1);
		},
		addToHiddenIds(state, id) {
			state.hiddenIds.push(id);
		},

		//OLD BELOW
		setWallpaperImageLoaded(state, loaded) {
			state.wallpaperLoaded = loaded;
		},
		setWallpapers(state, wps) {
			state.wallpapers = deepClone(wps);
			state.arrayUpdated = new Date().getTime();
			state.arrayUpdateChangeAmount = wps.length;
		},
		addCombinedWallpapers(state, wps) {
			state.wallpapers = deepClone(wps);
			state.arrayUpdated = new Date().getTime();
		},
		setWallpaperDataExpires(state, expiresOn) {
			state.expires = expiresOn;
		},
		setWallpaperLastSet(state, lastSet) {
			state.idLastSet = lastSet;
		},
		removeWallpaperFromArray(state, index) {
			state.wallpapers.splice(index, 1);
		},
		setArrayUpdated(state, t = new Date().getTime()) {
			state.arrayUpdated = t;
		},
		setArrayUpdateChangeAmount(state, amount) {
			state.arrayUpdateChangeAmount = amount;
		}
	},

	actions: {
		// COMMON ACTIONS
		settingsChanged() {
			//Some sort of check for if the collection setting has changed
		},
		async storageLoadFail({ commit, dispatch }) {
			await dispatch('fetchApiData');
			commit('setFinishedLoading', true);
		},
		async storageLoadSuccess({ getters, commit, dispatch }, localData) {
			dispatch('setLocalData', localData);
			if (getters.hasExpired) {
				commit('setDataStatus', "stale");
				await dispatch('fetchApiData');
			} else {
				commit('setDataStatus', "fresh");
				//checkWallpaperId: increase/decrease/set to 0?
				//must come after the setData dispatch, for wallpaper array length
				dispatch('checkWallpaperId');
			}			

			commit('setFinishedLoading', true);
		},
		setLocalData({ commit }, localData) {
			let {
				wallpapers = [],
				expires,
				arrayUpdated,
				arrayUpdateChangeAmount,
				idLastSet,
				currentWallpaperId,
				hiddenIds = []
			} = localData;
			
			// set all
			commit('setData', {
				wallpapers,
				expires,
				arrayUpdated,
				arrayUpdateChangeAmount,
				idLastSet,
				currentWallpaperId,
				hiddenIds
			});
		},
		setApiData({ commit }, apiData) {
			let {
				wallpapers,
				expires
			} = apiData;
			
			const arrayUpdated = new Date().getTime();
			const arrayUpdateChangeAmount = wallpapers.length;

			const idLastSet = new Date().getTime();
			const currentWallpaperId = 0;

			const hiddenIds = [];

			// set all
			commit('setData', {
				wallpapers,
				expires,
				arrayUpdated,
				arrayUpdateChangeAmount,
				idLastSet,
				currentWallpaperId,
				hiddenIds
			});
			
			commit('setDataStatus', "fresh");
		},
		async fetchApiData({getters, dispatch}) {
			try {
				const category = getters.category;
				let apiData = await apiRequest({category});
				dispatch('setApiData', {
					expires: apiData.expires,
					wallpapers: apiData.data
				});
			} catch (e) {
				console.warn("Could not load WALLPAPER api data...");
				console.warn(e);
			}			
		},

		// UNIQUE ACTIONS
		retrieveExtraWallpapers() {
			//uses getters.allowedToGetExtra
			//set array updated to prevent numerous retries
			//fetch data
			//merge unique
			//commit wallpapers
			//commit expires
			//commit change amount
		},

		retryLoading({state, getters, commit, dispatch}) {
			if (getters.dataLoadFailed) {
				dispatch('retryLoadingApiData');
			} else if (getters.dataLoadSuccessful && state.errorLoadingImage) {
				//retry loading wallpaper image
				commit('setErrorLoadingImage', false);
			}
		},

		async retryLoadingApiData({dispatch, commit}) {
			// commit('setFinishedLoading', false);
			await dispatch('fetchApiData');
			commit('setFinishedLoading', true);
		},

		goToNext({state, getters, commit}) {
			//if not finishedLoading return
			if (!state.finishedLoading) return;
			//increase id by one, and set lastSetId to now
			commit('setWallpaperId', { currentWallpaperId: getters.nextWallpaperId, idLastSet: new Date().getTime() });
			//TODO: FIRST LOAD NEXT WALLPAPER, ONLY THEN SET NEXT WALLPAPER ID
			//			MAYBE IN COMPONENT?
		},

		hideCurrent({state, getters, commit, dispatch}) {
			//if not finishedLoading, or showing default, return
			if (!state.finishedLoading || state.showingDefault) return;
			//if only 1 wallpaper left return
			if (state.wallpapers.length <= 1) return;
			//get current wallpaper id (not index, its unique id)
			const idToHide = getters.currentWallpaper.id;
			const indexToHide = state.currentWallpaperId;
			//get next wallpaper id, and if it is 0, the currentWallpaper id is the last one.
			//in that case, go to next wallpaper, else, set idLastSet to now
			if (getters.nextWallpaperId === 0) {
				dispatch('goToNext');
			} else {
				commit('setWallpaperId', { currentWallpaperId: state.currentWallpaperId, idLastSet: new Date().getTime() });
			}
			//remove wallpaper and add to hiddenIds
			//then, when new wallpapers are loaded, remove any wallpapers with id in hiddenIds
			commit('removeWallpaper', indexToHide);
			commit('addToHiddenIds', idToHide);

			console.log(`Hidden wallpaper. Previous 'currentWallpaperId' was ${indexToHide}, and currently is ${state.currentWallpaperId}. The id of the hidden wallpaper is ${idToHide}.`);
		},

		checkWallpaperId({ state, getters, commit }) {
			const now = new Date().getTime();
			const refresh = getters.refreshTime;

			let currentWallpaperId = state.currentWallpaperId;
			let idLastSet = state.idLastSet;

			if (idLastSet + refresh > now) {
				currentWallpaperId = getters.nextWallpaperId;
				idLastSet = now;
				commit('setWallpaperId', { currentWallpaperId, idLastSet });
			}
		},


		// OLD BELOW
		getAdditionalWallpapersFromServer({ state, getters, commit, dispatch, rootGetters }) {
			if (getters.wallpapersLength > 70) {
				console.warn("Wont load additional wallpapers because: too many wallpapers already loaded.", `${curLength} / 70`);
				return;
			};

			const lastUpdated = state.arrayUpdated;
			const lastChange = state.arrayUpdateChangeAmount;
			const lastPercentageChange = getters.arrayUpdateChangePercentage;
			const minTimeSince = 10 * 60 * 1000; //10 minutes
			const now = new Date().getTime();

			if (lastChange < 5) {
				console.warn("Wont load additional wallpapers because: last change was less than 5.", lastChange);
				return;
			};
			if (lastPercentageChange < 0.05) {
				console.warn("Wont load additional wallpapers because: last percentage change was less than 5%", lastPercentageChange);
				return;
			};
			if (now - (lastUpdated + minTimeSince) < 0) {
				console.warn("Wont load additional wallpapers because: not enough time has passed since last try");
				return;
			};
			
			//setting array updated in advance, to prevent numerous retries when it fails
			commit('setArrayUpdated');

			apiRequest({collection: rootGetters.wallpaperCollection})
				.then(data => {
					console.log("Additional wallpapers have been loaded from API! Amount:", data.data.length);
					dispatch('wallpaperSetAdditionalFromApi', data);
				})
				.catch(err => {
					console.warn(err);
					console.warn("New wallpapers could not be retrieved from server.");
				});
		},

		wallpaperSetAdditionalFromApi({state, commit}, apiData) {
			const {
				data: wallpapers = [],
				expires
			} = apiData;

			//first check for duplicates
			const wpBefore = deepClone(state.wallpapers);
			const combined = wpBefore.concat(wallpapers);
			const dupesRemoved = uniqueBy(combined, 'url');

			console.log(deepClone(wpBefore), wpBefore.length, deepClone(combined), combined.length, deepClone(dupesRemoved), dupesRemoved.length);

			const changeAmount = dupesRemoved.length - wpBefore.length;
			console.log("Change amount: ", changeAmount);

			commit('addCombinedWallpapers', dupesRemoved);
			commit('setArrayUpdateChangeAmount', changeAmount);

			commit('setWallpaperDataExpires', expires);
		},
		/*goToNextWallpaper({ state, getters, commit, dispatch }) {
			if (!state.dataLoaded) {
				console.warn("No wallpaper data is loaded, so can't go to next.");
				return;
			}

			const distanceFromEnd = (getters.wallpapersLength - 1) - state.currentWallpaperId;
			console.log("Distance from end: ", distanceFromEnd);
			
			if (distanceFromEnd < 3 && distanceFromEnd > 1) {
				console.log("Distance from end is good. Proceeding to getAdditionalWallpapersFromServer action");
				dispatch('getAdditionalWallpapersFromServer');
			}
				
			//TODO: some sort of action that loads an image, and than tells the store it is loaded and can be displayed
			dispatch('loadImageSource', getters.nextWallpaperUrl)
				.then(() => {
					dispatch('setCurrentWallpaperId', { id: getters.nextWallpaperId });
					commit('setWallpaperImageLoaded', true);
					dispatch('preloadNextImage');
				})
				.catch(e => {
					console.warn(e);
				});
		},*/

		hideCurrentWallpaper({ state, getters, commit, dispatch }) {
			const arrayLength = state.wallpapers.length;
			const currentId = state.currentWallpaperId;
			const nextId = getters.nextWallpaperId;

			if (!state.dataLoaded) {
				console.warn("No wallpaper data is loaded, so can't hide one.");
			} else if (arrayLength <= 1) {
				console.warn("Can't hide if only 1 wallpaper is left.");
			} else {
				if (nextId === 0) {
					console.warn("Viewing last wallpaper currently. Going to next wallpaper, and then removing the last wallpaper.");
					dispatch('setCurrentWallpaperId', {id: nextId});
				} else {
					dispatch('setCurrentWallpaperId', {id: currentId});
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
			dispatch('loadImageSource', url)
				.then(() => {
					commit('setWallpaperImageLoaded', true);
					dispatch('preloadNextImage');
				})
				.catch((err) => {
					console.warn(err);
					commit('setWallpaperImageLoaded', false);
				});
		},

		loadImageSource: ({ }, url) => {		
			return new Promise((resolve, reject) => {
				const image = new Image();

				let loaded = () => {
					clearTimeout(loadTimer);
					loadTimer = null;
					resolve(url);
				}

				function errorLoading(e) {
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

		preloadNextImage({state, getters}) {
			const nextUrl = getters.nextWallpaperUrl;
			if (state.dataLoaded && nextUrl) {
				const image = new Image();
				image.src = nextUrl;
			}
		},

		/*retryLoadingWallpapers({state, dispatch}) {
			if (!state.dataLoaded) {
				// if data loading failed
				console.log("Loading wallpaper data was unsuccesful, so retrying that now.");
				dispatch('getWallpapersFromServer');
			} else if (!state.wallpaperLoaded) {
				// if loading the wallpaper itself failed
				console.log("Loading wallpaper data was succesful, so retrying the wallpaper source now.");
				dispatch('loadingDataSucces');
			}			
		},*/

		setCurrentWallpaperId({ rootGetters, getters, commit }, {id, lastSet}) {
			let now = new Date().getTime();
			let newId = (id != null) ? id : 0;
			let newLastSet = lastSet ? lastSet : now;

			console.log(newLastSet, rootGetters.wallpaperRefresh, now);

			if (lastSet && (newLastSet + rootGetters.wallpaperRefresh < now)) {	
				console.warn("Timer has passed, current wallpaper id is cycled.");
				newId = (newId + 1) % getters.wallpapersLength;
				newLastSet = now;
			}

			commit('setWallpaperId', newId);
			commit('setWallpaperLastSet', newLastSet);
		},

		wallpaperSettingsChanged({commit, dispatch}) {
			commit('setDataLoaded', null);
			commit('setWallpaperImageLoaded', null);
			dispatch('getWallpapersFromServer');
		}
	}

}

export default wallpaperStore;