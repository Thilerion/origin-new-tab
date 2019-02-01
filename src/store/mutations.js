import { deepClone } from '../utils/deepObject';

export default {
	setSettingsData(state, settingsData) {
		console.log(settingsData);
		state.settingsData = { ...deepClone(settingsData) };
	},
	setLanguage(state, language) {
		state.settingsData.general.language = language;
	},
	setUsername(state, username) {
		state.settingsData.clock.username = username;
		if (state.editingUsername) state.editingUsername = false;
	},
	setFontSize(state, fontSize = null) {
		state.settingsData.general.fontSize = fontSize;
	},
	setUseCustomLocation(state, bool) {
		//TODO: dispatch to weather component (from action)
		state.settingsData.weather.useCustomLocation = !!bool;
	},
	setCustomLocationQuery(state, loc) {
		state.settingsData.weather.customLocationQuery = loc;
	},
	setWallpaperCollection(state, collection) {
		state.settingsData.wallpaper.wallpaperCollection = collection;
	},
	setWallpaperRefresh(state, timeout = 10) {
		state.settingsData.wallpaper.wallpaperRefresh = timeout;
	},
	setQuoteCategory(state, category) {
		state.settingsData.quote.category = category;
	},
	setNewsSlideInterval(state, interval) {
		state.settingsData.news.slideInterval = interval;
	},
	setShowSettings(state, bool) {
		if (bool == null) {
			state.showSettings = !state.showSettings;
			return;
		}
		state.showSettings = bool;
		if (!bool && window.location.hash) {
			history.pushState("", document.title, window.location.pathname);
		} else if (bool && !window.location.hash) {
			history.pushState("", document.title, '#settings');
		}
	},
	setEditingUsername(state, bool) {
		state.editingUsername = !!bool;
	}
};