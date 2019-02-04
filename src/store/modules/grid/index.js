import { GRID_ROWS, GRID_COLS, WIDGET_TYPE_BG, WIDGET_TYPE_GRID } from '@/constants.js';

import { ERR_REQUIRED, default as Validator } from '@/utils/validate.js';
import { loadFromStorage, saveToStorage } from '@/utils/lsHelpers';
import _debounce from 'lodash.debounce';

const storageData = loadFromStorage('sp_widgets');

// TODO: VALIDATORS ETC
// TODO: FOR NOW, USE THIS DEFAULTS OBJECT
const activeWidgetsDefaults = [
	{
		type: WIDGET_TYPE_BG,
		name: 'WallpaperUnsplash'
	}
];

const validatedData = [...activeWidgetsDefaults];

export const gridModule = {
	namespaced: true,

	state: {
		rows: GRID_ROWS,
		cols: GRID_COLS,
		activeWidgets: validatedData
	},

	getters: {
		currentWallpaperComponent: state => state.activeWidgets.find(w => w.type === WIDGET_TYPE_BG)
	},

	mutations: {

	},

	actions: {

	}
}



export const activeWidgetsPersistPlugin = store => {
	const reducerFn = state => (state.grid.activeWidgets);
	const watchCb = newValue => {
		console.log('Watcher triggered for "active widgets" module.');
		saveToStorage('sp_widgets', newValue);
	}
	const debouncedCb = _debounce(
		watchCb,
		500,
		{ maxWait: 10000 }
	);

	store.watch(
		reducerFn,
		debouncedCb,
		{ deep: true }
	);

	console.log('Store watcher created for "ACTIVE WIDGETS" module, by plugin.');
}