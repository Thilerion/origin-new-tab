export default {
	user: {
		name: "",
		// [nl, en]
		language: "nl",
		// range: 10-20, or 100%
		fontSize: '100%',
		activeWidgets: [
			'greeting',
			'news',
			'quote',
			'weather',
			'time'
		]
	},
	weather: {
		customLocation: null
	},
	wallpaper: {
		// any valid unsplash collection id. maybe provide a list as well?
		wallpaperCollection: 220388
	},
	quote: {
		// [motivinspirational, movies, famous]
		category: "motivinspirational"
	}	
}