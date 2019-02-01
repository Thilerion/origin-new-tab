const state = {
	// SETTINGS ETC.
	showSettings: window.location.hash.substr(1) === 'settings',
	editingUsername: false,

	settingsData: {
		general: {
			language: null,
			fontSize: null,
			timeFormat: ""
		},
		clock: {
			username: '',
			showTextGreeting: null,
			showDate: null
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
		}
	}
};

const getters = {
	settingsToWatch: state => {
		return { ...state.settingsData, widgets: [...state.activeWidgets.widgets] };
	},

	language: state => state.settingsData.general.language,
	fontSize: state => state.settingsData.general.fontSize,
	username: state => state.settingsData.clock.username,
	showTextGreeting: state => state.settingsData.clock.showTextGreeting,
	showDate: state => state.settingsData.clock.showDate,
	timeFormat: state => state.settingsData.general.timeFormat,
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
		return state.editingUsername || !state.settingsData.clock.username;
	}
};

export { state, getters };