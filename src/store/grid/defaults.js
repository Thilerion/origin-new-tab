import { presets } from '@/widgets';
const standardPreset = presets.standard;

// For each in array, check if the widget exists
// If it does, use it as default, else use the absolute default
const defaultWallpaperWidgets = [
	'WallpaperUnsplash'
];

// Use this wallpaper widget if none of the others is available
const absoluteDefaultWallpaperWidgets = 'WallpaperDefault';

export function getDefaultWallpaperWidget(availWidgets) {
	for (let i = 0; i < defaultWallpaperWidgets.length; i++) {
		if (availWidgets.includes(defaultWallpaperWidgets[i])) {
			return defaultWallpaperWidgets[i];
		}
	}
	return absoluteDefaultWallpaperWidgets;
}

export function getDefaultGridPreset(availWidgets) {
	return standardPreset.filter(widget => availWidgets.includes(widget.name));
}