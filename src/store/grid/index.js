import { getFromStorage, saveToStorage } from '@/utils/lsHelpers';
import { validateActiveWidgets, createNewWidget } from './validateActiveWidgets';
import { validateGridPreset } from './defaults';
import { presets, gridComponents } from '@/widgets';

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
		cols: GRID_COLS,

		allGridWidgetTypes: Object.keys(gridComponents)
	},

	getters: {
		usedGridWidgets: state => state.gridWidgets.map(w => w.name),
		unusedGridWidgets: (state, getters) => state.allGridWidgetTypes.filter(type => {
			return !getters.usedGridWidgets.includes(type);
		})
	},

	mutations: {
		editWidgetPosition(state, { idx, newWidget }) {
			state.gridWidgets.splice(idx, 1, newWidget);
		},
		editWidgetOrder(state, { uid, to }) {
			const from = state.gridOrder.indexOf(uid);
			console.log(`Moving ${uid} from ${from} to ${to}.`);
			state.gridOrder.splice(from, 1);
			state.gridOrder.splice(to, 0, uid);
		},
		editWidgetAlignment(state, { uid, dir, alignment }) {
			//TODO: validate if possible alignment for widget
			const idx = state.gridWidgets.findIndex(w => w.uid === uid);
			const w = { ...state.gridWidgets[idx] };
			const prop = dir === 'x' ? 'alignX' : 'alignY';
			
			w[prop] = alignment;
			state.gridWidgets.splice(idx, 1, w);
		},
		setGridWidgets(state, gridWidgets) {
			state.gridWidgets = [...gridWidgets];
		},
		setGridOrder(state, gridOrder) {
			state.gridOrder = [...gridOrder];
		},
		addWidget(state, widget) {
			state.gridWidgets.push(widget);
			state.gridOrder.push(widget.uid);
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
		},
		applyGridPreset({ commit }, presetName) {
			const layout = presets[presetName].value;
			const availWidgets = Object.keys(gridComponents);
			const validated = validateGridPreset(layout, availWidgets);

			commit('setGridWidgets', validated);
			commit('setGridOrder', validated.map(w => w.uid));
		},
		addNewWidget({ commit }, { x, y, width, height, widgetType }) {
			const validated = createNewWidget({
				x, y, width, height, name: widgetType
			});
			console.log(validated);
			commit('addWidget', validated);
			return validated.uid;
		}
	}
}