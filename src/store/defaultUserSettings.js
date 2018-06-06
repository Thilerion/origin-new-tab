const defaultSettings = {
	user: {
		name: "",
		// [nl, en]
		language: "nl",
		// range: 10-20, or null (which resets to 100% in base css file)
		fontSize: null,
		activeWidgets: [
			{name: 'greeting', active: true},
			{name: 'news', active: true},
			{name: 'quote', active: true},
			{name: 'weather', active: true}
		]
	},
	weather: {
		customLocation: null
	},
	wallpaper: {
		// any valid unsplash collection id. maybe provide a list as well?
		wallpaperCollection: 1457745,
		wallpaperCycleTimeout: 1 * 60 * 60 * 1000
	},
	quote: {
		// [motivinspirational, movies, famous]
		category: "motivinspirational"
	}	
}

const settingsOptions = {
	user: {
		language: [{ name: 'Nederlands', id: 'nl'}, { name: 'English', id: 'en'}],
		fontSize: {
			min: 10,
			max: 22
		}
	},
	wallpaper: {
		wallpaperCollection: [
			{ name: 'General', id: 220388 },
			{ name: 'Spectrum', id: 540518 },
			{ name: 'Reflections', id: 334800 },
			{ name: 'Moody Landscapes', id: 1457745 },
			{ name: 'Great Outdoors', id: 289662 },
			{ name: 'Road Less Travelled', id: 410546 }			
		],
		wallpaperCycleTimeout: [
			{ name: 'Altijd', value: 10 },
			{ name: 'Elk uur', value: 1 * 60 * 60 * 1000 },
			{ name: 'Elke 4 uur', value: 4 * 60 * 60 * 1000 },
			{ name: 'Elke dag', value: 18 * 60 * 60 * 1000 },
			{ name: 'Nooit', value: 100000000 }
		]
	},
	quote: {
		quoteCategory: ['motivinspirational', 'movies', 'famous']
	}
};

export { settingsOptions, defaultSettings };