export default {
	components: {
		settings: "Settings",
		general: "General",
		widgets: "Widgets",
		weather: "Weather",
		wallpaper: "Wallpaper",
		quote: "Quote",
		news: "News",
		topSites: "Most visited sites",
		topPages: "Most visited sites",
		clock: "Clock",
		calendar: "Calendar"
	},
	settings: {
		name: "Name",
		language: "Language",
		timeFormat: {
			title: "Time notation",
			'12': '12 hour',
			'24': '24 hour'
		},
		fontSize: {
			title: "Font size",
			default: "Default",
			custom: "Custom"
		},
		showGreeting: "Show greeting",
		showDate: "Show date",
		activeWidgets: "Active widgets",
		changeWidgetDisplay: "Customize layout",
		useCustomLocation: {
			title: "Use custom location",
			disabled: "No, use browser location",
			enabled: "Yes: "
		},
		units: {
			title: "Units",
			metric: "Metric",
			imperial: "Imperial"
		},
		wallpaperCollection: "Wallpaper collection",
		newWallpaper: {
			title: "New wallpaper every:",
			always: "New tab",
			hourlyOne: "Hour",
			hourlyFour: "4 hours",
			daily: "Day",
			never: "Never"
		},
		quoteCategory: {
			title: "Quote category",
			motivinspirational: "Inspirational",
			movies: "Movies",
			famous: "Famous persons"
		},
		newsInterval: "News article interval",
		topSitesAmount: "Amount of tiles",
		topSitesColumns: "Columns",
		resetSettings: "Restore default settings",
		save: "Save"
	},
	clock: {
		messages: ['Good morning', "Hi", 'Good evening', 'Good night'],
		saveHint: "Press [enter] to save"
	},
	wallpaperDetails: {
		photoBy: "Photo by ",
		on: " on ",
		photoFrom: "Photo from ",
		loadError: "Problem loading wallpaper. Showing default."
	},
	dates: {
		today: "Today",
		tomorrow: "Tomorrow"
	}
}