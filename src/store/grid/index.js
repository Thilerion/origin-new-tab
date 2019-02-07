import { getFromStorage, saveToStorage } from '@/utils/lsHelpers';
import { validateActiveWidgets } from './validateActiveWidgets';

import { GRID_ROWS, GRID_COLS } from '@/constants';

export const STORAGE_KEY = 'sp_grid';
const savedState = getFromStorage(STORAGE_KEY);
let validatedState = validateActiveWidgets(savedState);
saveToStorage(STORAGE_KEY, validatedState);

export const gridModule = {
	namespaced: false,

	state: {
		...validatedState,
		rows: GRID_ROWS,
		cols: GRID_COLS
	},

	getters: {

	},

	mutations: {

	},

	actions: {

	}
}