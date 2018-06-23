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
		state.settingsData.general.username = username;
		if (state.editingUsername) state.editingUsername = false;
	},
	setFontSize(state, fontSize = null) {
		state.settingsData.general.fontSize = fontSize;
	},
	setWidgets(state, widgets) {
		state.settingsData.widgets = [...widgets];
	},
	setWidgetActive(state, { name, active }) {
		state.settingsData.widgets.find(w => w.name === name).active = active;
	},
	setUseCustomLocation(state, bool) {
		//TODO: dispatch to weather component (from action)
		state.settingsData.weather.useCustomLocation = !!bool;
	},
	setCustomLocationToUse(state, loc) {
		state.settingsData.weather.customLocationToUse = loc;
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
	
	toggleDnd(state) {
		state.dndEnabled = !state.dndEnabled;
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
	},
	setGridSize(state, { cols, rows }) {
		state.gridCols = cols;
		state.gridRows = rows;
	},
	setWidgetPositionOnGrid(state, { index, moveCols, moveRows }) {
		let row = [...state.settingsData.widgets[index].row].map(n => n += moveRows);
		let col = [...state.settingsData.widgets[index].column].map(n => n += moveCols);
		state.settingsData.widgets[index].column = [...col];
		state.settingsData.widgets[index].row = [...row];
	},
	setWidgetSizeOnGrid(state, { index, cols, rows }) {
		state.settingsData.widgets[index].column = [...cols];
		state.settingsData.widgets[index].row = [...rows];
	},
	changeWidgetFontSize(state, { index, amount }) {
		state.settingsData.widgets[index].fontSize += amount;
	},
	setWidgetAlignment(state, { index, alignment }) {
		state.settingsData.widgets[index].align = alignment;
	}
};