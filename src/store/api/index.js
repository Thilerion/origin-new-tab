import axios from 'axios';
import BASE_URL from './config.api';

const axiosOptions = {
	timeout: 6000
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
			console.log("DATA IN API FILE: ", data);
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
			console.log("DATA IN API FILE: ", data);
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
			console.log("DATA IN API FILE: ", data);
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
			console.log("DATA IN API FILE: ", data);
			return data.data;
		}
	}
};
export default widgets;