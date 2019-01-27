import {wallpaperRequest as apiRequest} from '../api/';

import { deepClone, uniqueBy } from '@/utils/deepObject';

import DefaultWallpaper from '@/assets/wallpaper/default_wallpaper.jpg';

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
			url: DefaultWallpaper,
			urlUser: "https://unsplash.com/@goodvybesdaily",
			user: "mike anderson",
			location: "Ganekogorta, Spain",
			urlDownload: DefaultWallpaper,
			urlRaw: DefaultWallpaper,
			id: 0
		},

		finishedLoading: false,
		dataStatus: null,

		loadingImage: false,
		errorLoadingImage: false,
		currentLoadedURL: "",

		loadAdditionalRequirements: {
			minTime: 10 * 60 * 60 * 1000, //10 minutes
			maxWallpaperAmount: 70,
			minChangeAmount: 5,
			minChangePercentage: 0.05,
			distanceFromEnd: 2
		}
	},

	getters: {
		// COMMMON GETTERS
		toWatch(state) {
			const { wallpapers, currentWallpaperId, expires, idLastSet, arrayUpdated, arrayUpdateChangeAmount, hiddenIds } = state;
			return { wallpapers, currentWallpaperId, expires, idLastSet, arrayUpdated, arrayUpdateChangeAmount, hiddenIds };
		},


		hasExpired(state) {
			return state.expires - new Date().getTime() < 0;
		},

		dataLoadSuccessful(state) {
			//dataStatus either "fresh" or "stale" and loading is finished
			return state.dataStatus != null && state.finishedLoading;
		},
		
		dataLoadFailed(state) {
			//this means data could not be loaded
			return state.dataStatus === null && state.finishedLoading;
		},

		dataInvalid(state) {
			if (state.finishedLoading) return false;
			if (!state.expires) return true;
			if (!Array.isArray(state.wallpapers)) return true;
			if (state.wallpapers.length < 1) return true;
			if (!Number.isInteger(state.currentWallpaperId)) return true;
			if (!Array.isArray(state.hiddenIds)) return true;
			if (state.currentWallpaperId > state.wallpapers.length - 1) return true;
			if (state.hiddenIds.includes(null) || state.hiddenIds.includes(undefined)) return true;
			if (!state.wallpapers[0].hasOwnProperty("id")) return true;
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

		showExternal(state, getters) {
			return !!getters.dataLoadSuccessful && !state.errorLoadingImage;
		},
		showDefault(state, getters) {
			return !!getters.dataLoadFailed || state.errorLoadingImage;
		},
		showAny(state, getters) {
			return getters.showExternal || getters.showDefault;
		},

		currentWallpaper(state, getters) {
			if (getters.showExternal) return state.wallpapers[state.currentWallpaperId];
			else if (getters.showDefault) return state.defaultWallpaper;
		},
		nextWallpaper(state, getters) {
			if (getters.dataLoadSuccessful) return state.wallpapers[getters.nextWallpaperId];
			else return null;
		},

		arrayUpdateChangePercentage(state) {
			return state.arrayUpdateChangeAmount / state.wallpapers.length;
		},
		canRetrieveAdditional(state, getters) {
			const reqs = state.loadAdditionalRequirements;

			const distanceFromEnd = state.wallpapers.length - 1 - state.currentWallpaperId;
			const timePassedSinceUpdate = new Date().getTime() - state.arrayUpdated;

			if (distanceFromEnd > reqs.distanceFromEnd) {				
				return false;
			} else if (state.wallpapers.length > reqs.maxWallpaperAmount) {
				return false;
			} else if (getters.arrayUpdateChangePercentage < reqs.minChangePercentage) {
				return false;
			} else if (state.arrayUpdateChangeAmount < reqs.minChangeAmount) {
				return false;
			} else if (timePassedSinceUpdate < reqs.minTime) {
				return false;
			} else {
				return true;
			}
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

		setArrayUpdated(state, t = new Date().getTime()) {
			state.arrayUpdated = t;
		},
		setAdditionalWallpapers(state, { wallpapers, expires, arrayUpdateChangeAmount }) {
			state.wallpapers = [...wallpapers];
			state.expires = expires;
			state.arrayUpdateChangeAmount = arrayUpdateChangeAmount;
		},

		setExpiresToNow(state) {
			state.expires = new Date().getTime();
		},
		setCurrentLoadedURL(state, url) {
			state.currentLoadedURL = url;
		}
	},

	actions: {
		// COMMON ACTIONS
		settingsChanged({commit, dispatch}, changes = []) {
			//Some sort of check for if the collection setting has changed
			if (changes.includes('collection')) {
				// set expires to now so that, if it fails, next time a tab is opened, it will try again
				commit('setExpiresToNow');
				dispatch('fetchApiData');
			}
		},
		async storageLoadFail({ commit, dispatch }) {
			await dispatch('fetchApiData');
			commit('setFinishedLoading', true);
		},
		async storageLoadSuccess({ getters, commit, dispatch }, localData) {
			dispatch('setLocalData', localData);
			if (getters.hasExpired || getters.dataInvalid) {
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
				const collection = getters.collection;
				let apiData = await apiRequest({collection});
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

			if (idLastSet + refresh < now) {
				currentWallpaperId = getters.nextWallpaperId;
				idLastSet = now;
				commit('setWallpaperId', { currentWallpaperId, idLastSet });
			}
		},

		async retrieveExtraWallpapers({ state, getters, commit }) {
			try {
				//uses getters.allowedToGetExtra
				if (!getters.canRetrieveAdditional) return;

				//set array updated to prevent numerous retries
				commit('setArrayUpdated');

				//fetch data
				const collection = getters.collection;
				let apiData = await apiRequest({collection});
				
				//merge unique, remove all in hiddenIds
				const wallpapersInitial = [...state.wallpapers];
				const lengthInitial = wallpapersInitial.length;

				const merged = wallpapersInitial.concat(apiData.data);
				const dupesRemoved = uniqueBy(merged, 'id');

				const wallpapersAfter = dupesRemoved.filter(w => !state.hiddenIds.includes(w.id));
				const lengthAfter = wallpapersAfter.length;
				const changeAmount = lengthAfter - lengthInitial;

				//commit wallpapers, expires, changeAmount
				commit('setAdditionalWallpapers', {
					wallpapers: wallpapersAfter,
					arrayUpdateChangeAmount: changeAmount,
					expires: apiData.expires
				});

			} catch (e) {
				console.warn("Could not load WALLPAPER api data...");
				console.warn(e);
			}
		},



		// OLD BELOW
		wallpaperSettingsChanged({commit, dispatch}) {
			commit('setDataLoaded', null);
			commit('setWallpaperImageLoaded', null);
			dispatch('getWallpapersFromServer');
		}
	}

}

export default wallpaperStore;