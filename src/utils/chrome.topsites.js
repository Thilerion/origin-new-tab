const TEST_TOPSITE_DATA = [	
	{
		title: "!!TEST DATA!!",
		url: "https://google.com/"
	},	
	{
		title: "!!current environment does not support chrome.topSites",
		url: "https://google.com/"
	},
	{
		title: "reddit: the front page of the internet",
		url: "https://www.reddit.com/"
	},
	{
		title: "GitHub",
		url: "https://github.com/"
	},
	{
		title: "NU.nl",
		url: "https://www.nu.nl/"
	},
	{
		title: "YouTube",
		url: "https://www.youtube.com/"
	},
	{
		title: "Gmail",
		url: "https://gmail.com/"
	},
	{
		title: "Google Calendar",
		url: "https://google.com/calendar"
	},
	{
		title: "WhatsApp",
		url: "https://web.whatsapp.com/"
	},
	{
		title: "Google Search",
		url: "https://google.com/"
	},
];


function getTopSites() {
	return new Promise((resolve, reject) => {
		if (chrome && chrome.topSites && chrome.topSites.get) {
			chrome.topSites.get((arr) => {
				resolve([...arr]);
			})
		} else if (window && process.env.NODE_ENV === 'development') {
			console.warn("chrome.topSites is not available. Loading test data for topSites.");
			resolve([...TEST_TOPSITE_DATA]);
		} else {
			console.error("NODE_ENV is not 'development', but chrome.topSites is not available. Could not load topSites.");
			reject();
		}
	})
}

export default getTopSites;