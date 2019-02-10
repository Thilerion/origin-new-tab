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
		editWidgetPosition(state, { idx, newWidget }) {
			state.gridWidgets.splice(idx, 1, newWidget);
		}
	},

	actions: {
		setWidgetPosition({ state, commit }, { type, idx, values = {} } = {}) {
			const { x, y, width, height } = values;

			const w = state.gridWidgets[idx];

			if (type === 'move') {
				const newWidget = { ...w, x, y };
				commit('editWidgetPosition', { idx, newWidget });
			} else if (type === 'resize') {
				const newWidget = { ...w, x, y, width, height };
				commit('editWidgetPosition', { idx, newWidget });
			}
		}
	}
}