import * as Unsplash from './Unsplash';
import * as Clock from './Clock';
import * as News from './News';
import * as Weather from './Weather';

import standard from './_presets/standard';

const presets = {
	standard: {
		name: 'Standard',
		value: standard
	}
}

const WidgetTypes = {
	Unsplash,
	Clock,
	News,
	Weather
};

// TODO: allow combining of multiple widget settings in one category
const settingCategoryOrder = [
	{ name: 'Clock', value: 'clock' },
	{ name: 'Wallpaper', value: 'unsplash' },
	{ name: 'News', value: 'news' },
	{ name: 'Weather', value: 'weather' }
]

const getWidgetSettings = (widgets) => {
	const obj = {};
	for (const [wName, wVal] of Object.entries(widgets)) {
		if (wVal && wVal.settings) obj[wName] = wVal.settings;
	}
	return obj;
}

const getWidgetComponents = (widgets) => {
	const grid = {};
	const wallpaper = {};

	for (const wName in widgets) {
		if (!widgets[wName]) continue;
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

const getSettingsComponents = (widgets) => {
	const comps = {};

	for (const wName in widgets) {
		if (!widgets[wName]) continue;
		if (widgets[wName].settingsComponent) {
			comps[wName.toLowerCase()] = widgets[wName].settingsComponent;
		}
	}
	return comps;
}

// TODO: set default settings for when a widget is missing a setting such as minHeight
const getWidgetDisplayConfigs = (widgets) => {
	let widgetConfigs = Object.keys(widgets).reduce((acc, val) => {
		const w = widgets[val] && widgets[val].displayConfig;
		if (w) {
			for (const component in w) {
				acc[component] = w[component];
			}
		}
		return acc;
	}, {});
	return widgetConfigs;
}

const { gridComponents, wallpaperComponents } = getWidgetComponents(WidgetTypes);
const settingsComponents = getSettingsComponents(WidgetTypes);
const settings = getWidgetSettings(WidgetTypes);
const displayConfigs = getWidgetDisplayConfigs(WidgetTypes);

export { gridComponents, wallpaperComponents, settings, settingsComponents, settingCategoryOrder, displayConfigs, presets };