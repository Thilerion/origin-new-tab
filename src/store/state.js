const state = {
	dndEnabled: false,
	showSettings: window.location.hash.substr(1) === 'settings',
	gridCols: null,
	gridRows: null,
	editingUsername: false,

	settingsData: {
		general: {
			language: null,
			username: '',
			fontSize: null,
			showTextGreeting: null
		},
		widgets: [],
		weather: {
			useCustomLocation: false,
			customLocationToUse: ""
		},
		wallpaper: {
			wallpaperCollection: null,
			wallpaperRefresh: null
		},
		quote: {
			category: ""
		},
		news: {
			slideInterval: null
		},
		topSites: {
			maxTopSites: null,
			columns: null
		},
		calendar: {}
	}
};

const getters = {
	settingsWatch: state => state.settingsData,

	language: state => state.settingsData.general.language,
	username: state => state.settingsData.general.username,
	fontSize: state => state.settingsData.general.fontSize,
	showTextGreeting: state => state.settingsData.general.showTextGreeting,
	widgets: state => state.settingsData.widgets,
	widgetByIndex: state => index => state.settingsData.widgets[index],
	widgetByName: state => name => state.settingsData.widgets.find(w => w.name === name),
	widgetIndexByName: state => name => state.settingsData.widgets.findIndex(w => w.name === name),
	useCustomLocation: state => state.settingsData.weather.useCustomLocation,
	customLocationToUse: state => state.settingsData.weather.customLocationToUse,
	locationToUse: (state, getters) => {
		if (getters.useCustomLocation && state.settingsData.weather.customLocationToUse) {
			return state.settingsData.weather.customLocationToUse;
		} else return getters['weather/addressCity'];
	},
	wallpaperCollection: state => state.settingsData.wallpaper.wallpaperCollection,
	wallpaperRefresh: state => state.settingsData.wallpaper.wallpaperRefresh,
	quoteCategory: state => state.settingsData.quote.category,
	newsSlideInterval: state => state.settingsData.news.slideInterval,
	maxTopSites: state => state.settingsData.topSites.maxTopSites,
	topSiteColumns: state => state.settingsData.topSites.columns,

	showSettings(state) {
		return !!state.showSettings;
	},
	isEditingUsername(state) {
		return state.editingUsername || !state.settingsData.general.username;
	},
	gridCols: state => state.gridCols,
	gridRows: state => state.gridRows
};

export { state, getters };