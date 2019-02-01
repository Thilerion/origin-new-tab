import { wallpaperRequest as apiRequest } from '../api/';

import { uniqueBy } from '@/utils/deepObject';

import DefaultWallpaper from '@/assets/wallpaper/default_wallpaper.jpg';

const widgetName = "wallpaper";

const defaultWallpaperObj = {
	url: DefaultWallpaper,
	urlUser: "https://unsplash.com/@goodvybesdaily",
	user: "mike anderson",
	location: "Ganekogorta, Spain",
	urlDownload: DefaultWallpaper,
	urlRaw: DefaultWallpaper,
	id: 0
};

const loadAdditionalRequirements = {
	minTime: 10 * 60 * 60 * 1000, //10 minutes
	maxWallpaperAmount: 70,
	minChangeAmount: 5,
	minChangePercentage: 0.05,
	distanceFromEnd: 2
};

const wallpaperStore = {
	namespaced: true,

	state: {
		data: {
			wallpapers: [],
			currentWallpaperId: 0,
			idLastSet: null,
			arrayUpdated: Date.now(),
			arrayUpdateChangeAmount: null,
			hiddenIds: [],
		},

		expires: null,

		finishedLoading: false,
		dataStatus: null,

		// UNIQUE WIDGET-SPECIFIC SETTINGs
		defaultWallpaper: { ...defaultWallpaperObj },
		loadAdditionalRequirements: loadAdditionalRequirements,

		// UNIQUE WIDGET-SPECIFIC FUNCTIONALITY
		loadingImage: false,
		errorLoadingImage: false,
		currentLoadedURL: ""
	},

	getters: {
		toWatch: state => ({ data: state.data, expires: state.expires }),		
		hasExpired: state => (state.expires - Date.now() < 0),

		dataLoadSuccessful: state => state.dataStatus != null && state.finishedLoading,
		dataLoadFailed: state => state.dataStatus === null && state.finishedLoading,

		// TODO: specific function that returns true if the current state.data is not valid
		/*
		dataInvalid: state => {
			specific function here
		},
		*/
		dataInvalid(state) {
			if (state.finishedLoading) return false;
			if (!state.expires) return true;
			if (!Array.isArray(state.data.wallpapers)) return true;
			if (state.data.wallpapers.length < 1) return true;
			if (!Number.isInteger(state.data.currentWallpaperId)) return true;
			if (!Array.isArray(state.data.hiddenIds)) return true;
			if (state.data.currentWallpaperId > state.data.wallpapers.length - 1) return true;
			if (state.data.hiddenIds.includes(null) || state.data.hiddenIds.includes(undefined)) return true;
			if (!state.data.wallpapers[0].hasOwnProperty("id")) return true;
		},

		// UNIQUE GETTERS
		collection({ }, { }, { }, rootGetters) {
			return rootGetters.wallpaperCollection;	
		},
		refreshTime({ }, { }, { }, rootGetters) {
			return rootGetters.wallpaperRefresh;	
		},
		nextWallpaperId(state) {
			return state.data.wallpapers.length === 0 ? 0 : (state.data.currentWallpaperId + 1) % state.data.wallpapers.length;
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
			if (getters.showExternal) return state.data.wallpapers[state.data.currentWallpaperId];
			else if (getters.showDefault) return state.defaultWallpaper;
		},
		nextWallpaper(state, getters) {
			if (getters.dataLoadSuccessful) return state.data.wallpapers[getters.nextWallpaperId];
			else return null;
		},

		arrayUpdateChangePercentage(state) {
			return state.data.arrayUpdateChangeAmount / state.data.wallpapers.length;
		},
		canRetrieveAdditional(state, getters) {
			const reqs = state.loadAdditionalRequirements;

			const distanceFromEnd = state.data.wallpapers.length - 1 - state.data.currentWallpaperId;
			const timePassedSinceUpdate = new Date().getTime() - state.data.arrayUpdated;

			if (distanceFromEnd > reqs.distanceFromEnd) {				
				return false;
			} else if (state.data.wallpapers.length > reqs.maxWallpaperAmount) {
				return false;
			} else if (getters.arrayUpdateChangePercentage < reqs.minChangePercentage) {
				return false;
			} else if (state.data.arrayUpdateChangeAmount < reqs.minChangeAmount) {
				return false;
			} else if (timePassedSinceUpdate < reqs.minTime) {
				return false;
			} else {
				return true;
			}
		}
	},

	mutations: {
		setData(state, { expires, data }) {
			// TODO: because nested arrays, do some kind of deep merge/clone
			state.expires = expires;
			state.data = { ...state.data, ...data };
		},
		setFinishedLoading(state, bool) {
			state.finishedLoading = !!bool;
		},
		setDataStatus(state, status) {
			state.dataStatus = status;
		},

		// UNIQUE MUTATIONS
		setWallpaperId(state, { currentWallpaperId = 0, idLastSet = new Date().getTime() }) {
			state.data.currentWallpaperId = currentWallpaperId;
			state.data.idLastSet = idLastSet;
		},
		setErrorLoadingImage(state, bool) {
			state.errorLoadingImage = bool;
		},
		setCurrentlyLoadingImage(state, bool) {
			// to disable loading a new image when still loading
			state.loadingImage = bool;
		},
		removeWallpaper(state, index) {
			state.data.wallpapers.splice(index, 1);
		},
		addToHiddenIds(state, id) {
			state.data.hiddenIds.push(id);
		},

		setArrayUpdated(state, t = new Date().getTime()) {
			state.data.arrayUpdated = t;
		},
		setAdditionalWallpapers(state, { wallpapers, expires, arrayUpdateChangeAmount }) {
			state.data.wallpapers = [...wallpapers];
			state.expires = expires;
			state.data.arrayUpdateChangeAmount = arrayUpdateChangeAmount;
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
		setLocalData({ commit }, { data, expires }) {
			commit('setData', {	expires, data });
		},
		// TODO: in fetchApiData, merge these defaults in with "data" prop to make
		// TODO: 	this action at least reusable
		setApiData({ commit }, { wallpapers, expires }) {			
			const arrayUpdated = new Date().getTime();
			const arrayUpdateChangeAmount = wallpapers.length;

			const idLastSet = new Date().getTime();
			const currentWallpaperId = 0;

			const hiddenIds = [];

			const data = { wallpapers, arrayUpdated, arrayUpdateChangeAmount, idLastSet, currentWallpaperId, hiddenIds };

			commit('setData', { data, expires });			
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
			if (state.data.wallpapers.length <= 1) return;
			//get current wallpaper id (not index, its unique id)
			const idToHide = getters.currentWallpaper.id;
			const indexToHide = state.data.currentWallpaperId;
			//get next wallpaper id, and if it is 0, the currentWallpaper id is the last one.
			//in that case, go to next wallpaper, else, set idLastSet to now
			if (getters.nextWallpaperId === 0) {
				dispatch('goToNext');
			} else {
				commit('setWallpaperId', { currentWallpaperId: state.data.currentWallpaperId, idLastSet: new Date().getTime() });
			}
			//remove wallpaper and add to hiddenIds
			//then, when new wallpapers are loaded, remove any wallpapers with id in hiddenIds
			commit('removeWallpaper', indexToHide);
			commit('addToHiddenIds', idToHide);

			console.log(`Hidden wallpaper. Previous 'currentWallpaperId' was ${indexToHide}, and currently is ${state.data.currentWallpaperId}. The id of the hidden wallpaper is ${idToHide}.`);
		},

		checkWallpaperId({ state, getters, commit }) {
			const now = new Date().getTime();
			const refresh = getters.refreshTime;

			let currentWallpaperId = state.data.currentWallpaperId;
			let idLastSet = state.data.idLastSet;

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
				const wallpapersInitial = [...state.data.wallpapers];
				const lengthInitial = wallpapersInitial.length;

				const merged = wallpapersInitial.concat(apiData.data);
				const dupesRemoved = uniqueBy(merged, 'id');

				const wallpapersAfter = dupesRemoved.filter(w => !state.data.hiddenIds.includes(w.id));
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