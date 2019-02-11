import { presets } from '@/widgets';
import { createUID } from '../../utils/uid';
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
	return standardPreset.reduce((acc, widget) => { 
		const name = widget.name;
		if (!availWidgets.includes(name)) {
			return acc;
		}
		if (!widget.uid) {
			acc.push({ ...widget, uid: createUID(name) });
		} else {
			acc.push(widget);
		}
		return acc;
	}, []);
}