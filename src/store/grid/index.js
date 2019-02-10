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
		setWidgetPosition(state, { idx, x, y }) {
			if (idx == null || x == null || y == null) {
				console.warn(`[GridStore]: missing values in setWidgetPosition mutation.`, { idx, x, y });
				return;
			} else if (x < 1 || y < 1 || x > state.cols + 1 || y > state.rows + 1) {
				console.warn(`[GridStore]: values out of bounds in setWidgetPosition mutation.`, { idx, x, y });
				return;
			}

			const w = state.gridWidgets[idx];
			w.x = x;
			w.y = y;
			console.log('Mutation widget position to:', { x, y });
		}
	},

	actions: {
		
	}
}