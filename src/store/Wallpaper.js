import { getWallpapersFromCollection } from './api/wallpapers';

const wallpaperStore = {

	state: {
		defaultWallpaper: require('@/assets/wallpaper/default_wallpaper.jpg'),
		failedLoadingWallpaper: null,
		blur: false,
		collection: 220388,
		wallpapers: [],
		currentWallpaperId: 0
	},

	getters: {
		defaultWallpaper: state => state.defaultWallpaper,
		isBlurred: state => state.blur,
		currentWallpaper: state => {
			if (state.failedLoadingWallpaper === true) return state.defaultWallpaper;
			if (state.failedLoadingWallpaper === null) return;
			return state.wallpapers[state.currentWallpaperId];
		},
		failedLoadingWallpaper: state => state.failedLoadingWallpaper
	},

	mutations: {
		enableBlur: state => state.blur = true,
		disableBlur: state => state.blur = false,
		setWallpapers: (state, data) => state.wallpapers = data,
		nextWallpaper: state => {
			const arLength = state.wallpapers.length;
			const nextId = state.currentWallpaperId + 1;
			state.currentWallpaperId = nextId % arLength;
		},
		setStatusLoadingWallpaper: (state, status) => state.failedLoadingWallpaper = !!status
	},

	actions: {
		async getWallpapersFromCollection({ commit }) {
			try {
				let wp = await getWallpapersFromCollection();
				if (wp.data.success) {
					commit('setWallpapers', wp.data.data);
					commit('setStatusLoadingWallpaper', false);
				} else {
					throw new Error('failed loading wallpapers');
				}				
			}
			catch (e) {
				console.warn(e);
				commit('setStatusLoadingWallpaper', true);
			}
		}
	}

}

export default wallpaperStore;