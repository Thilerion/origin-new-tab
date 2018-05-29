import Unsplash from './api/wallpaper';
const unsplash = new Unsplash();

const wallpaperStore = {

	state: {
		defaultWallpaper: require('@/assets/wallpaper/default_wallpaper.jpg'),
		blur: false,
		collection: 220388,
		wallpapers: [],
		currentWallpaperId: 0
	},

	getters: {
		defaultWallpaper: state => state.defaultWallpaper,
		isBlurred: state => state.blur,
		currentWallpaper: state => state.wallpapers[state.currentWallpaperId]
	},

	mutations: {
		enableBlur: state => state.blur = true,
		disableBlur: state => state.blur = false,
		setWallpapers: (state, data) => state.wallpapers = [...data, ...state.wallpapers],
		nextWallpaper: state => {
			const arLength = state.wallpapers.length;
			const nextId = state.currentWallpaperId + 1;
			state.currentWallpaperId = nextId % arLength;
		}
	},

	actions: {
		async getWallpapers({commit}) {		
			//TODO: try/catch
			let wallpapers = await unsplash.randomFromCollection();
			console.log(wallpapers);
			commit('setWallpapers', wallpapers.data);
		}
	}

}

export default wallpaperStore;