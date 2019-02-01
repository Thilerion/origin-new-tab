import { ApiRequest } from '../common/api.service.js';

const unsplashModule = {
	namespaced: true,
	
	state: {
		data: {
			// List of wallpapers retrieved from unsplash
			wallpapers: [],
			// Current wallpaper to show
			currentId: 0,
			// List of wallpaper ids that should be hidden
			hiddenIds: [],

			// Last time a new wallpaper was shown (for interval setting)
			lastCurrentChange: null,
			// Last time the wallpapers list was refreshed for the current category
			// Reason is to load new wallpapers from the category if all have been seen
			lastArrayChange: null,
			// Amount of new wallpapers retrieved last time the array was refreshed
			// Reason is to prevent trying to load new wallpapers when there are none
			lastArrayChangeAmount: null
		},

		// When to force-refresh the wallpapers array / data property
		expires: null

		//finishedloading, datastatus
	},

	getters: {
		hasExpired: state => (state.expires - Date.now() < 0),

		settings(s, g, rootState) {
			return rootState.settings.unsplash;
		}
	},

	mutations: {

	},

	actions: {

	}
}

export default unsplashModule;