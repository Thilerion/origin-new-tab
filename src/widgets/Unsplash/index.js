import WallpaperUnsplash from './WallpaperUnsplash.vue';

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
		getDefault: () => (1 * 60 * 60 * 1000) // 1 hour in ms
	}
}

export const displayConfig = {};