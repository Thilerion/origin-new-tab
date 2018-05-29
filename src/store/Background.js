const backgroundStore = {

	state: {
		defaultBackground: require('@/assets/wallpaper/default_wallpaper.jpg'),
		blur: false
	},

	getters: {
		defaultBackground: state => state.defaultBackground,
		isBlurred: state => state.blur
	},

	mutations: {
		enableBlur: state => state.blur = true,
		disableBlur: state => state.blur = false
	},

	actions: {

	}

}

export default backgroundStore;