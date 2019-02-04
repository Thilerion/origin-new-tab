/**
 * Import the config files of each widget, extracting the settings part and
 * creating validators.
 */
import { config as unsplashConfig } from './WallpaperUnsplash/config.js';

/**
 * Construct default settings
 */
const widgetSettings = {
	unsplash: unsplashConfig.settings
};

export { widgetSettings };