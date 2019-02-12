import WallpaperUnsplash from './WallpaperUnsplash.vue';
import WidgetUnsplashDetails from './WidgetUnsplashDetails.vue';
import { REFRESH_INTERVALS } from './constants';

export const gridComponents = {
	WidgetUnsplashDetails
};

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

export const displayConfig = {
	WidgetUnsplashDetails: {
		minWidth: 3,
		maxWidth: null,
		minHeight: 2,
		maxHeight: 5,
		canResize: true,
		canMove: true
	}
};