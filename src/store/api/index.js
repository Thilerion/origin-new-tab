import axios from 'axios';
import BASE_URL from './config.api';

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
	}
};
export default widgets;