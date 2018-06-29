import getUILanguage from '@/store/libs/getUILanguage';

const defaultSettings = {
	general: {
		// [nl, en]
		language: "en",
		// range: 10-20, or null (which resets to 100% in base css file)
		fontSize: null,
		timeFormat: 'HH:mm'
	},
	clock: {
		username: "",
		showTextGreeting: true,
		showDate: false
	},
	widgets: [
		{ 
			name: 'clock',
			active: true,
			row: [7, 13],
			column: [9, 33],
			align: 1,
			vAlign: 1,
			fontSize: -1,
		},
		{ 
			name: 'news',
			active: true,
			row: [1, 3],
			column: [9, 33],
			align: 1,
			vAlign: 1,
			fontSize: -1
		},
		{ 
			name: 'quote',
			active: true,
			row: [2, 4],
			column: [9, 33],
			align: 1,
			vAlign: 1,
			fontSize: -2
		},
		{ 
			name: 'weather',
			active: true,
			row: [1, 4],
			column: [35, 41],
			align: 2,
			vAlign: 0,
			fontSize: -1
		},
		{ 
			name: 'topPages',
			active: true,
			row: [16, 21],
			column: [11, 31],
			align: 1,
			vAlign: 1,
			fontSize: -3
		},
		{
			name: 'settingsButton',
			active: true,
			row: [20, 21],
			column: [40, 41],
			align: 2,
			vAlign: 2,
			fontSize: 0
		},
		{
			name: 'wallpaperDetails',
			active: true,
			row: [19, 21],
			column: [1, 13],
			align: 0,
			vAlign: 2,
			fontSize: -1
		},
		{
			name: 'calendar',
			active: false,
			row: [1, 7],
			column: [1, 11],
			align: 0,
			vAlign: 0,
			fontSize: -1
		}
	],
	weather: {
		useCustomLocation: false,
		customLocationQuery: "",
		units: 'ca'
	},
	wallpaper: {
		// any valid unsplash collection id. maybe provide a list as well?
		wallpaperCollection: 477172,
		wallpaperRefresh: 1 * 60 * 60 * 1000
	},
	quote: {
		// [motivinspirational, movies, famous]
		category: "motivinspirational"
	},
	news: {
		slideInterval: 6000
	},
	topSites: {
		maxTopSites: 10,
		columns: 5
	},
	calendar: {}
}

const settingsOptions = {
	general: {
		language: [{ name: 'Nederlands', id: 'nl', altIds: []}, { name: 'English', id: 'en', altIds: ['en-GB', 'en-US']}],
		fontSize: {
			min: 10,
			max: 22
		},
		timeFormat: [
			{ name: 12, value: 'hh:mm A' },
			{ name: 24, value: 'HH:mm' }
		]
	},
	weather: {
		units: [
			{ name: 'Metric', value: 'ca' },
			{ name: 'Imperial', value: 'us' }
		]
	},
	widgets: {
		align: {
			0: 'left',
			1: 'center',
			2: 'right'
		},
		vAlign: {
			0: 'top',
			1: 'middle',
			2: 'bottom'
		},
		storageModules: [
			'news',
			'quote',
			'weather',
			'wallpaper',
			'calendar'
		],
		widgetOptions: {
			clock: {
				disable: true,
				zIndex: 1,
				move: true,
				grid: true,
				resize: true,
				align: true,
				vAlign: true,
				fontSize: {
					canChange: true,
					min: -8,
					max: 2
				}
			},
			news: {
				disable: true,
				zIndex: 20,
				move: true,
				grid: true,
				resize: true,
				align: false,
				vAlign: true,
				fontSize: {
					canChange: true,
					min: -4,
					max: 4
				}
			},
			quote: {
				disable: true,
				zIndex: 20,
				move: true,
				grid: true,
				resize: true,
				align: true,
				vAlign: true,
				fontSize: {
					canChange: true,
					min: -4,
					max: 4
				}
			},
			weather: {
				disable: true,
				zIndex: 40,
				move: true,
				grid: true,
				resize: true,
				align: true,
				vAlign: true,
				fontSize: {
					canChange: true,
					min: -4,
					max: 4
				}
			},
			topPages: {
				disable: true,
				zIndex: 30,
				move: true,
				grid: true,
				resize: true,
				align: true,
				vAlign: true,
				fontSize: {
					canChange: true,
					min: -4,
					max: 4
				}
			},
			calendar: {
				disable: true,
				zIndex: 10,
				move: true,
				grid: true,
				resize: true,
				align: true,
				vAlign: true,
				fontSize: {
					canChange: true,
					min: -4,
					max: 4
				}
			},
			wallpaperDetails: {
				disable: false,
				zIndex: 10,
				move: true,
				grid: true,
				resize: true,
				align: true,
				vAlign: true,
				fontSize: {
					canChange: true,
					min: -4,
					max: 4
				}
			},
			settingsButton: {
				disable: false,
				zIndex: 100,
				move: false,
				grid: true,
				resize: false,
				align: false,
				vAlign: false,
				fontSize: {
					canChange: false,
					min: 0,
					max: 0
				}
			}
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
		wallpaperRefresh: [
			{ id: 'always', value: 10 },
			{ id: 'hourlyOne', value: 1 * 60 * 60 * 1000 },
			{ id: 'hourlyFour', value: 4 * 60 * 60 * 1000 },
			{ id: 'daily', value: 18 * 60 * 60 * 1000 },
			{ id: 'never', value: 100000000 }
		]
	},
	quote: {
		quoteCategory: ['motivinspirational', 'movies', 'famous']
	},
	news: {
		slideInterval: {
			min: 4000,
			max: 60000
		}
	},
	topSites: {
		maxTopSites: {
			min: 2,
			max: 10
		},
		columns: {
			min: 1,
			max: 10
		}
	}
};

const uiLang = getUILanguage();
let foundLanguage;
if (uiLang) {
	foundLanguage = settingsOptions.general.language.find(o => {
		return (o.id === uiLang || o.altIds.includes(uiLang))
	});
}
console.log(foundLanguage);
if (!!foundLanguage) {
	console.warn("Setting default language to " + foundLanguage.id);
	defaultSettings.general.language = foundLanguage.id;
} else {
	console.warn("Default language stays " + defaultSettings.general.language);
}

export { settingsOptions, defaultSettings };