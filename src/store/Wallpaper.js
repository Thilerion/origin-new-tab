import axios from 'axios';

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
		collection: 220388,
		wallpapers: [],
		currentWallpaperId: 0
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
			return state.wallpapers[state.currentWallpaperId];
		},
		wallpaperLoadSuccess: state => state.wallpaperLoadSuccess,
		wallpaperInitialized: state => state.wallpaperLoadSuccess != null
	},

	mutations: {
		setWallpapers: (state, data) => {
			state.wallpapers = data
		},
		nextWallpaper: state => {
			const arLength = state.wallpapers.length;
			const nextId = state.currentWallpaperId + 1;
			state.currentWallpaperId = nextId % arLength;
		},
		setWallpaperLoadSuccess: (state, status) => state.wallpaperLoadSuccess = !!status,
		setWallpaperData: (state, {wallpapers, collection, currentWallpaperId}) => {
			state.wallpapers = wallpapers;
			state.collection = collection;
			state.currentWallpaperId = currentWallpaperId;
		}
	},

	actions: {
		async getWallpapersFromServer({ state, commit, dispatch }) {
			try {
				const collection = state.collection;
				let res = await axios.get(`http://localhost:3000/wallpapers/${collection}`);
				
				if (res.data.success) {
					commit('setWallpapers', res.data.data);
					dispatch('saveWallpapersToStorage');
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
		getWallpapersFromStorage({ commit, dispatch }) {
			const wallpapers = localStorage.getItem('sp_wallpapers');
			if (wallpapers) {				
				commit('setWallpaperData', JSON.parse(wallpapers));
				commit('setWallpaperLoadSuccess', true);
			} else {
				console.log("Failed to get wallpapers from storage");
				dispatch('getWallpapersFromServer');
			}
		},
		saveWallpapersToStorage({state}) {
			const wallpapers = {
				wallpapers: state.wallpapers,
				collection: state.collection,
				currentWallpaperId: state.currentWallpaperId
			}
			localStorage.setItem('sp_wallpapers', JSON.stringify(wallpapers));
		}
	}

}

export default wallpaperStore;