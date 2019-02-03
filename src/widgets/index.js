/**
 * Import the defaultSettings of every Widget, without loading the
 * parts that are supposed to be async (such as store.js and main.vue)
 */
import { defaultSettings as unsplash } from './WallpaperUnsplash/config.js';

/**
 * Construct default settings
 */
const defaultWidgetSettings = {
	unsplash
};

export { defaultWidgetSettings };