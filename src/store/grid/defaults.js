import { presets } from '@/widgets';
import { createUID } from '../../utils/uid';
const standardPreset = presets.standard;

// For each in array, check if the widget exists
// If it does, use it as default, else use the absolute default
const defaultWallpaperWidgets = [
	'WallpaperUnsplash',
	'WallpaperDefault'
];

export function getDefaultWallpaperWidget(availWidgets) {
	const n = defaultWallpaperWidgets.length;

	for (let i = 0; i < n - 1; i++) {
		if (availWidgets.includes(defaultWallpaperWidgets[i])) {
			return defaultWallpaperWidgets[i];
		}
	}
	// Move WallpaperDefault if all others unavailable
	return defaultWallpaperWidgets[n - 1];
}

export function validateGridPreset(preset, availWidgets) {
	return preset.reduce((acc, widget) => {
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

export function getDefaultGridPreset(availWidgets) {
	const preset = standardPreset.value;
	return validateGridPreset(preset, availWidgets);
}