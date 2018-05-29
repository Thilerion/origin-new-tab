const wallpaperStore = {

	state: {
		defaultWallpaper: require('@/assets/wallpaper/default_wallpaper.jpg'),
		blur: false
	},

	getters: {
		defaultWallpaper: state => state.defaultWallpaper,
		isBlurred: state => state.blur
	},

	mutations: {
		enableBlur: state => state.blur = true,
		disableBlur: state => state.blur = false
	},

	actions: {

	}

}

export default wallpaperStore;