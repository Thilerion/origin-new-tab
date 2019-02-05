/**
 * Import the config files of each widget, extracting the settings part and
 * creating validators.
 */
import { config as unsplashConfig } from './WallpaperUnsplash/config.js';
import { config as clockConfig } from './Clock/config';

/**
 * Construct default settings
 */
const widgetSettings = {
	unsplash: unsplashConfig.settings,
	clock: clockConfig.settings
};

export { widgetSettings };