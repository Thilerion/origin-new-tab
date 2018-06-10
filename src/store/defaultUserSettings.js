const defaultSettings = {
	user: {
		name: "",
		// [nl, en]
		language: "nl",
		// range: 10-20, or null (which resets to 100% in base css file)
		fontSize: null,
		widgets: [
			{ 
				name: 'greeting',
				active: true,
				row: [8, 14],
				column: [9, 33],
				fontSize: -1
			},
			{ 
				name: 'news',
				active: true,
				row: [1, 3],
				column: [11, 31],
				fontSize: 0
			},
			{ 
				name: 'quote',
				active: true,
				row: [3, 5],
				column: [11, 31],
				fontSize: -2
			},
			{ 
				name: 'weather',
				active: true,
				row: [1, 6],
				column: [35, 41],
				fontSize: 1
			},
			{ 
				name: 'topPages',
				active: true,
				row: [15, 20],
				column: [11, 31],
				fontSize: 0
			},
			{
				name: 'settingsButton',
				active: true,
				row: [20, 21],
				column: [40, 41],
				fontSize: 0
			},
			{
				name: 'wallpaperDetails',
				active: true,
				row: [19, 21],
				column: [1, 13],
				fontSize: 1
			},
			{
				name: 'calendar',
				active: true,
				row: [8, 14],
				column: [1, 13],
				fontSize: 1
			}
		]
	},
	weather: {
		customLocation: null
	},
	wallpaper: {
		// any valid unsplash collection id. maybe provide a list as well?
		wallpaperCollection: 477172,
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
		},
		widgets: {
			canBeDisabled: ['greeting', 'news', 'quote', 'weather', 'topPages', 'calendar'],
			canBeMoved: ['greeting', 'news', 'quote', 'weather', 'topPages', 'wallpaperDetails', 'calendar'],
			displayInGrid: ['greeting', 'news', 'quote', 'weather', 'topPages', 'settingsButton', 'wallpaperDetails', 'calendar'],
			haveStorageModule: ['user', 'news', 'quote', 'weather', 'wallpaper', 'calendar']
		}
	},
	wallpaper: {
		wallpaperCollection: [
			{ name: 'General', id: '220388,460827' },
			{ name: 'Spectrum', id: 540518 },
			{ name: 'Reflections', id: 334800 },
			{ name: 'Moody Landscapes', id: 1457745 },
			{ name: 'Beautiful Landscape Light', id: 477172 },
			{ name: 'Great Outdoors', id: 289662 },
			{ name: 'Aerial', id: 1685892 },
			{ name: 'Abstract Landscape/Nature', id: 1242150 },
			{ name: 'Raindrops & Glass', id: 1410320 },
			{ name: 'Blurrr', id: 420324 },
			{ name: 'Leafy', id: 548245 },
			{ name: 'Abstract', id: 416021 },
			{ name: 'Monochrome', id: 400620 },
			{ name: 'Above The Trees', id: 1525582 },
			{ name: 'Minimal', id: '145238,1657511' },
			{ name: 'Flood', id: 869015 },
			{ name: 'Space', id: 1111575 },
			{ name: 'Pastel & Pale', id: 531563 },
			{ name: 'The Deep Sea', id: 461104 },
			{ name: 'Au Naturel', id: 881815 }
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