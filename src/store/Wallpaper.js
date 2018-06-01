import axios from 'axios';
import API_URL from './api/config.api';

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
		wallpaperLoadSuccess: null,
		wallpaperData: {
			wallpapers: [],
			currentWallpaperId: 0,
			collection: 220388
		}
	},

	getters: {
		currentWallpaper: state => {
			const loaded = state.wallpaperLoadSuccess;
			if (loaded === null) {
				return;
			}
			if (loaded === false) {
				return state.defaultWallpaper;
			}
			return state.wallpaperData.wallpapers[state.wallpaperData.currentWallpaperId];
		},
		collection: state => state.wallpaperData.collection,
		wallpaperWatch: state => {
			return state.wallpaperData;
		},
		wallpaperLoadSuccess: state => state.wallpaperLoadSuccess,
		wallpaperInitialized: state => state.wallpaperLoadSuccess != null,
		wallpaperColor: (state, getters) => {
			if (getters.currentWallpaper) return getters.currentWallpaper.color;
			else return;
		},
		nextWallpaperId: state => {
			let length = state.wallpaperData.wallpapers.length;
			if (length === 0) return 0;
			let cur = state.wallpaperData.currentWallpaperId;

			let next = (cur + 1) % length;
			console.log(next);
			return next;
		},
		nextWallpaperUrl: (state, getters) => {
			try {
				return state.wallpaperData.wallpapers[getters.nextWallpaperId].url;
			}
			catch (e) {
				return "";
			}			
		}
	},

	mutations: {
		setWallpapers: (state, data) => state.wallpaperData.wallpapers = data,
		setCurrentWallpaperId(state, id) {
			if (state.wallpaperData.wallpapers.length - 1 < id < 0) {
				state.wallpaperData.currentWallpaperId = 0;
			} else if (!id) {
				state.wallpaperData.currentWallpaperId = 0;
			} else {
				state.wallpaperData.currentWallpaperId = id;
			}			
		},
		setCollection: (state, col) => state.wallpaperData.collection = col,
		nextWallpaper: state => {
			const arLength = state.wallpaperData.wallpapers.length;
			if (!arLength) state.wallpaperData.currentWallpaperId = 0;
			const nextId = state.wallpaperData.currentWallpaperId + 1;
			state.wallpaperData.currentWallpaperId = nextId % arLength;
		},
		setWallpaperLoadSuccess: (state, status) => state.wallpaperLoadSuccess = !!status,
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
		}
	},

	actions: {
		async getWallpapersFromServer({ state, commit, dispatch }) {
			try {
				const collection = state.wallpaperData.collection;
				let res = await axios.get(`${API_URL}/wallpapers/${collection}`);
				
				if (res.data.success) {
					commit('setWallpapers', res.data.data);
					commit('setWallpaperLoadSuccess', true);
				} else {
					throw new Error('failed loading wallpapers');
				}				
			}
			catch (e) {
				console.warn(e);
				commit('setWallpaperLoadSuccess', false);
			}
		},
		wallpaperSet({ commit, dispatch }, {wallpapers, currentWallpaperId, collection}) {
			console.log("Wallpaper Set");
			console.log(!!wallpapers, !!currentWallpaperId, !!collection);
			if (wallpapers && currentWallpaperId >= 0 && collection) {
				commit('setWallpapers', wallpapers);
				commit('setCurrentWallpaperId', currentWallpaperId);
				commit('setCollection', collection);
				commit('setWallpaperLoadSuccess', true);
			} else {
				dispatch('wallpaperLoadFailed');
			}
		},
		wallpaperLoadFailed({ commit, dispatch }) {
			dispatch('getWallpapersFromServer');
		}
	}

}

export default wallpaperStore;