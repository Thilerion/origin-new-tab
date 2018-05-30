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
		setWallpapers: (state, data) => state.wallpapers = data,
		nextWallpaper: state => {
			const arLength = state.wallpapers.length;
			const nextId = state.currentWallpaperId + 1;
			state.currentWallpaperId = nextId % arLength;
		},
		setWallpaperLoadSuccess: (state, status) => state.wallpaperLoadSuccess = !!status
	},

	actions: {
		async getWallpapersFromCollection({ state, commit }) {
			try {
				const collection = state.collection;
				let res = await axios.get(`http://localhost:3000/wallpapers/${collection}`);
				
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
		}
	}

}

export default wallpaperStore;