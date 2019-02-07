import WallpaperUnsplash from './WallpaperUnsplash.vue';
import { REFRESH_INTERVALS } from './constants';

export const gridComponents = {};

export const wallpaperComponents = {
	WallpaperUnsplash
}

export const settings = {
	collection: {
		name: 'collection',
		getDefault: () => '477172'
	},
	refreshInterval: {
		name: 'refreshInterval',
		getDefault: () => REFRESH_INTERVALS.ALWAYS
	}
}

export const displayConfig = {};