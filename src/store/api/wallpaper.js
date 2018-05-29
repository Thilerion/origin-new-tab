const BASE_URL = "https://api.unsplash.com/";
const ACCESS_KEY = "0ddd4a7e383887ff3803f6ef66944d0f44797ca3db1472f99f8ce576671b0863";

import axios from 'axios';

import defaults from './defaults';
const defaultWallpaperResponse = defaults.wallpapers;

class Unsplash {
	constructor(w = 1920, h = 1080) {
		this.w = w;
		this.h = h;

		this.http = axios.create({
			baseURL: BASE_URL,
			timeout: 1000,
			headers: {
				'Authorization': `Client-ID ${ACCESS_KEY}`
			}
		});
	}

	randomFromCollection(collection = 220388, count = 30) {
		if (process.env.NODE_ENV === 'production') {
			return this.http({
				url: '/photos/random',
				params: {
					w: this.w,
					h: this.h,
					collections: collection,
					orientation: 'landscape',
					count: Math.max(Math.min(30, count), 1)
				}
			});
		} else {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve(defaultWallpaperResponse);
				}, 100);
			})
		}		
	}
}

export default Unsplash;