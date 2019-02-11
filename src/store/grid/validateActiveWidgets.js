import { displayConfigs, gridComponents, wallpaperComponents } from '@/widgets';
import WidgetDisplaySetting from './WidgetDisplaySettings';
// Finds a default wallpaper widget using the list of available widgets
import { getDefaultWallpaperWidget, getDefaultGridPreset } from './defaults.js';

import { GRID_COLS, GRID_ROWS } from '@/constants';

const globalConfig = {
	rows: GRID_ROWS,
	columns: GRID_COLS
}

// Names for each grid and wallpaper widget
const gridComponentNames = Object.keys(gridComponents);
const wallpaperComponentNames = Object.keys(wallpaperComponents);

function validateActiveWidgets(savedState = {}) {
	const { gridWidgets, gridOrder, wallpaperWidget } = (savedState || {});

	let wallpaperWidgetValid;

	const noWallpaperWidget = !wallpaperWidget;
	const invalidWallpaperWidget = !wallpaperComponentNames.includes(wallpaperWidget);

	if (noWallpaperWidget || invalidWallpaperWidget) {
		// console.warn(`[ActiveWidgets]: no active wallpaper widget found!`);
		wallpaperWidgetValid = getDefaultWallpaperWidget(wallpaperComponentNames);
	} else {
		wallpaperWidgetValid = wallpaperWidget;
	}

	let {
		validatedWidgets: validatedGridWidgets,
		validatedOrder
	} = validateGridWidgets(
		gridWidgets,
		gridOrder,
		gridComponentNames,
		displayConfigs
	);

	if (!validatedGridWidgets) {
		// console.warn(`[ActiveWidgets]: no valid/active grid widgets found!`);
		validatedGridWidgets = getDefaultGridPreset(gridComponentNames);
		validatedOrder = validatedGridWidgets.map(w => w.uid);
	}

	return {
		gridWidgets: validatedGridWidgets,
		gridOrder: validatedOrder,
		wallpaperWidget: wallpaperWidgetValid
	}
}

function validateGridWidgets(
	gridWidgets,
	gridOrder = [],
	componentNames,
	displayConfigs
) {
	if (!gridWidgets ||
		!Array.isArray(gridWidgets) ||
		gridWidgets.length < 1
	) {
		return false;	
	}

	const validatedWidgets = gridWidgets.reduce((valid, curWidget) => {
		try {
			const validator = new WidgetDisplaySetting(curWidget);

			const { validComponent, name } = validator.validateName(componentNames);
			if (!validComponent) return valid;

			// FILTER OUT DEV-ONLY WIDGETS (such as placeholderWidget)
			if (process && process.env && process.env.NODE_ENV !== 'development' && displayConfigs[name] && displayConfigs[name].DEV_ONLY) {
				return valid;
			}

			const validatedSettings = validator.validateSettings(displayConfigs[name], globalConfig);
			if (!validatedSettings) return valid;

			valid.push(validatedSettings);
			return valid;
		} catch (e) {
			return valid;
		}
	}, []);

	const widgetUids = validatedWidgets.map(w => w.uid);

	// Remove all widgets that no longer exist in validatedWidgets
	const validatedOrder = gridOrder.filter(uid => widgetUids.includes(uid));

	// Check if all widgetUids are in validatedOrder
	widgetUids.forEach(uid => {
		if (!validatedOrder.includes(uid)) {
			// add to start of validatedOrderArray (most in the background)
			validatedOrder.unshift(uid);
		}
	})

	return !!validatedWidgets.length && { validatedWidgets, validatedOrder };
}

export { validateActiveWidgets };