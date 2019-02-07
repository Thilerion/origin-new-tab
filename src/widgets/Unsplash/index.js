import WallpaperUnsplash from './WallpaperUnsplash.vue';

export const gridComponents = {};

export const wallpaperComponents = {
	WallpaperUnsplash
}

export const settings = {
	unsplashSetting: {
		name: 'unsplashSetting',
		getDefault: () => 'default unsplash Setting A'
	},
	anotherUnsplashSetting: {
		name: 'anotherUnsplashSetting',
		getDefault: () => ({
			thisIs: 'a default setting for',
			unsplashWidget: 'yes it is'
		})
	}
}

export const displayConfig = {};