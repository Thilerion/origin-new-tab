import axios from 'axios';
import BASE_URL from './config.api';

import parse from 'date-fns/parse';
import addDays from 'date-fns/add_days'

function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

const axiosOptions = {
	timeout: 20000
}

const widgets = {
	'user': {
		api: false,
	},
	'wallpaper': {
		api: true,
		url: {
			required: ['collection'],
			get(collection) {
				return `${BASE_URL}/wallpapers/${collection}`
			}
		},
		async request(url) {
			let data = await axios.get(url, axiosOptions);
			console.log(`%cRequest complete from "WALLPAPER", with the following data:\n`, "color: white; background-color: #089108; line-height: 1.5; font-weight: bold;", deepClone(data.data));
			return data.data;
		}
	},
	'quote': {
		api: true,
		url: {
			required: [],
			get(quoteCategory) {
				if (quoteCategory) return `${BASE_URL}/quote/${quoteCategory}`
				return `${BASE_URL}/quote`
			}
		},
		async request(url) {
			let data = await axios.get(url, axiosOptions);
			console.log(`%cRequest complete from "QUOTE", with the following data:\n`, "color: white; background-color: #089108; line-height: 1.5; font-weight: bold;", deepClone(data.data));
			return data.data;
		}
	},
	'weather': {
		api: true,
		url: {
			required: ['latitude', 'longitude'],
			get(latitude, longitude) {
				return `${BASE_URL}/forecast/${latitude}/${longitude}`
			}
		},
		async request(url) {
			let data = await axios.get(url, axiosOptions);
			console.log(`%cRequest complete from "WEATHER", with the following data:\n`, "color: white; background-color: #089108; line-height: 1.5; font-weight: bold;", deepClone(data.data));
			return data.data;
		}
	},
	'news': {
		api: true,
		url: {
			required: [],
			get() {
				return `${BASE_URL}/news`
			}
		},
		async request(url) {
			let data = await axios.get(url, axiosOptions);
			console.log(`%cRequest complete from "NEWS", with the following data:\n`, "color: white; background-color: #089108; line-height: 1.5; font-weight: bold;", deepClone(data.data));
			return data.data;
		}
	},
	'calendar': {
		api: true,
		url: {
			required: [],
			get() {
				return "https://www.googleapis.com/calendar/v3/calendars/primary/events"
			}
		},
		async request(url, token) {
			let gCalOptions = {
				params: {
					maxResults: 30,
					singleEvents: true,
					orderBy: "startTime",
					timeMin: parse(new Date().setHours(0, 0, 0, 0)),
					timeMax: addDays(new Date().setHours(0, 0, 0, 0), 14)
				},
				headers: {
					Authorization: `Bearer ${token}`
				}
			};
			let options = { ...axiosOptions, ...gCalOptions };
			
			try {
				let data = await axios.get(url, options);
				console.log(`%cRequest complete from "CALENDAR", with the following data:\n`, "color: white; background-color: #089108; line-height: 1.5; font-weight: bold;", deepClone(data.data));
				return data.data;
			}
			catch (err) {
				//error status: err.response.status
				//error message if google error: err.response.data.error.message
				if (err.response) {
					console.log(`Error in getting 'CALENDAR' data with status ${err.response.status}: ${err.response.data.error.message}.`);

					throw new Error(`${err.response.status}: ${err.response.data.error.message}`);
				} else {
					throw new Error("Error in 'CALENDAR' data request.");
				}
			}			
		}
	},
	'location': {
		api: true,
		url: {
			required: [],
			get() {
				return `${BASE_URL}/location`;
			}
		},
		async request(url, query) {
			let params = { ...query };
			let options = { ...axiosOptions, params };
			let data = await axios.get(url, options);
			console.log(`%cRequest complete from "LOCATION", with the following data:\n`, "color: white; background-color: #089108; line-height: 1.5; font-weight: bold;", deepClone(data.data));
			return data.data;
		}
	}
};
export default widgets;