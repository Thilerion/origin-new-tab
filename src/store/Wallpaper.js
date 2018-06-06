import widgetsApi from './api/index';
const wallpaperApi = widgetsApi.wallpaper;

const WALLPAPER_CYCLE_TIMEOUT = 1 * 60 * 60 * 1000; //1 uur

const wallpaperStore = {

	state: {
		defaultWallpaper: {
			url: require('@/assets/wallpaper/default_wallpaper.jpg'),
			urlUser: "",
			user: "",
			location: "",
			urlDownload: require('@/assets/wallpaper/default_wallpaper.jpg'),
			urlRaw: require('@/assets/wallpaper/default_wallpaper.jpg')
		},
		dataLoaded: false,
		dataLoadFailure: false,
		reloadingWallpapers: false,
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

		// TODO: change how "reloadingWallpapers" works
		showWallpaper: state => (state.dataLoaded || state.dataLoadFailure) && !state.reloadingWallpapers,
		showDefaultWallpaper: state => !state.dataLoaded && state.dataLoadFailure,
		showExternalWallpaper: state => state.dataLoaded && !state.dataLoadFailure && !state.reloadingWallpapers,

		currentWallpaperId: state => state.wallpaperData.currentWallpaperId,
		currentExternalWallpaper: (state, getters) => state.wallpaperData.wallpapers[getters.currentWallpaperId] || null,
		wallpaperCollection: state => state.wallpaperData.collection,

		// Replaces "currentWallpaper"
		wallpaperToShow(state, getters) {
			if (!getters.showWallpaper) return null;
			if (getters.showExternalWallpaper) return getters.currentExternalWallpaper;
			if (getters.showDefaultWallpaper && !getters.showExternalWallpaper) return state.defaultWallpaper;
		},
		wallpaperUrl(state, getters) {
			return getters.wallpaperToShow ? getters.wallpaperToShow.url : null;
		},

		nextWallpaperId(state, getters) {
			const l = state.wallpaperData.wallpapers.length;
			if (l === 0) return 0;
			return (getters.currentWallpaperId + 1) % l;
		},
		nextWallpaperUrl: (state, getters) => {
			if (getters.showExternalWallpaper) return state.wallpaperData.wallpapers[getters.nextWallpaperId].url;
			else return "";
		},
		currentWallpaperSet: state => state.wallpaperData.currentWallpaperSet,
		timeUntilNextWallpaper: state => {
			const expires = state.wallpaperData.currentWallpaperSet + WALLPAPER_CYCLE_TIMEOUT;
			const now = new Date().getTime();
			const msUntilNew = expires - now;
			return `${Math.floor(msUntilNew / 1000 / 60)} minutes, ${Math.floor(msUntilNew / 1000 % 60)} seconds`
		}
	},

	mutations: {
		setWallpapers: (state, data) => state.wallpaperData.wallpapers = [...data],
		setWallpaperExpires: (state, n) => state.wallpaperData.expires = n,
		setCurrentWallpaperId(state, id) {
			if (state.wallpaperData.wallpapers.length - 1 < id < 0) {
				state.wallpaperData.currentWallpaperId = 0;
			} else if (!id) {
				state.wallpaperData.currentWallpaperId = 0;
			} else {
				state.wallpaperData.currentWallpaperId = id;
			}			
		},
		setCollection: (state, col) => {
			state.wallpaperData.collection = col;
		},
		setCurrentWallpaperSet: (state, time = new Date().getTime()) => state.wallpaperData.currentWallpaperSet = time, 
		nextWallpaper: state => {
			const arLength = state.wallpaperData.wallpapers.length;
			if (!arLength) state.wallpaperData.currentWallpaperId = 0;
			const nextId = state.wallpaperData.currentWallpaperId + 1;
			state.wallpaperData.currentWallpaperId = nextId % arLength;
			state.wallpaperData.currentWallpaperSet = new Date().getTime();
		},
		disableCurrentWallpaper(state) {
			if (state.wallpaperData.wallpapers.length < 2) {
				console.warn("Can't hide if only 1 wallpaper is left.");
			} else {
				const index = state.wallpaperData.currentWallpaperId;

				if (state.wallpaperData.wallpapers.length - 1 === index) {
					state.wallpaperData.currentWallpaperId -= 1;				
				}				
				state.wallpaperData.wallpapers.splice(index, 1);
			}
		},
		setWallpaperData(state, { wallpapers, expires, currentWallpaperId, collection }) {
			state.wallpaperData.wallpapers = [...wallpapers];
			state.wallpaperData.expires = expires;
			state.wallpaperData.currentWallpaperId = currentWallpaperId;
			state.wallpaperData.collection = collection;
		},
		setWallpaperLoadFailure: (state, bool = true) => state.dataLoadFailure = bool,
		setWallpaperLoaded: (state, bool = true) => state.dataLoaded = bool,
		setReloadingWallpapers: (state, bool) => state.reloadingWallpapers = bool
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
			const { wallpapers = [], expires, currentWallpaperId = 0, collection, currentWallpaperSet } = localData;
			const commitData = { wallpapers, expires, currentWallpaperId, collection };
			commit('setWallpaperData', commitData);
			if (currentWallpaperSet && new Date().getTime() - currentWallpaperSet > WALLPAPER_CYCLE_TIMEOUT) {
				console.warn(`${WALLPAPER_CYCLE_TIMEOUT / 1000 / 60} minutes have passed since last time wallpaper has changed. Setting next wallpaper now.`);
				commit('nextWallpaper');
			} else {
				commit('setCurrentWallpaperSet', currentWallpaperSet);
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