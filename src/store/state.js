const state = {
	dndEnabled: false,
	showSettings: window.location.hash.substr(1) === 'settings',
	gridCols: null,
	gridRows: null,
	showHorizontalLine: false,
	showVerticalLine: false,
	showEdgeLines: [false, false, false, false],
	editingUsername: false,

	settingsData: {
		general: {
			language: null,
			fontSize: null,
			timeFormat: ""
		},
		greeting: {
			username: '',
			showTextGreeting: null
		},
		widgets: [],
		weather: {
			useCustomLocation: false,
			customLocationQuery: "",
			units: ""
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
	settingsToWatch: state => state.settingsData,

	language: state => state.settingsData.general.language,
	fontSize: state => state.settingsData.general.fontSize,
	username: state => state.settingsData.greeting.username,
	showTextGreeting: state => state.settingsData.greeting.showTextGreeting,
	timeFormat: state => state.settingsData.general.timeFormat,
	widgets: state => state.settingsData.widgets,
	widgetByIndex: state => index => state.settingsData.widgets[index],
	widgetByName: state => name => state.settingsData.widgets.find(w => w.name === name),
	widgetIndexByName: state => name => state.settingsData.widgets.findIndex(w => w.name === name),
	useCustomLocation: state => state.settingsData.weather.useCustomLocation,
	customLocationQuery: state => state.settingsData.weather.customLocationQuery,
	units: state => state.settingsData.weather.units,
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
		return state.editingUsername || !state.settingsData.greeting.username;
	},
	gridCols: state => state.gridCols,
	gridRows: state => state.gridRows,
	showEdgeLines(state) {
		if (!state.dndEnabled) return [false, false, false, false];
		return state.showEdgeLines;
	}
};

export { state, getters };