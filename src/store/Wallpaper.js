import Unsplash from './api/wallpaper';
const unsplash = new Unsplash();

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
		setWallpapers: (state, data) => state.wallpapers = [...data, ...state.wallpapers],
		nextWallpaper: state => {
			const arLength = state.wallpapers.length;
			const nextId = state.currentWallpaperId + 1;
			state.currentWallpaperId = nextId % arLength;
		},
		setStatusLoadingWallpaper: (state, status) => state.failedLoadingWallpaper = !!status
	},

	actions: {
		async getWallpapers({commit}) {		
			try {
				let wallpapers = await unsplash.randomFromCollection();
				console.log(wallpapers);
				commit('setWallpapers', wallpapers.data);
				commit('setStatusLoadingWallpaper', false);
			}
			catch (e) {
				console.warn(e);
				commit('setStatusLoadingWallpaper', true);
			}
		}
	}

}

export default wallpaperStore;