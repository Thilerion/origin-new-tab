import * as Unsplash from './Unsplash';
// import * as Clock from './Clock';
import standard from './_presets/standard';

const WidgetTypes = {
	Unsplash,
	// Clock
};

const getWidgetSettings = (widgets) => {
	const obj = {};
	for (const [wName, wVal] of Object.entries(widgets)) {
		if (wVal.settings != null) obj[wName] = wVal.settings;
	}
	return obj;
}

const getWidgetComponents = (widgets) => {
	const grid = {};
	const wallpaper = {};

	for (const wName in widgets) {
		if (widgets[wName].gridComponents) {
			const comps = widgets[wName].gridComponents;
			for (const compName in comps) {
				grid[compName] = comps[compName];
			}
		}
		if (widgets[wName].wallpaperComponents) {
			const comps = widgets[wName].wallpaperComponents;
			for (const compName in comps) {
				wallpaper[compName] = comps[compName];
			}
		}
	}
	return { gridComponents: grid, wallpaperComponents: wallpaper };
}

const getWidgetDisplayConfigs = (widgets) => {
	let components = {};

	for (const wName in widgets) {
		if (widgets[wName].displayConfigs) {
			components = { ...components, ...widgets[wName].displayConfigs };
		}
	}
	return components;
}

const { gridComponents, wallpaperComponents } = getWidgetComponents(WidgetTypes);
const settings = getWidgetSettings(WidgetTypes);
const displayConfigs = getWidgetDisplayConfigs(WidgetTypes);
const presets = {
	standard
}

export { gridComponents, wallpaperComponents, settings, displayConfigs, presets };