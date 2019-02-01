import { GRID_COLS, GRID_ROWS } from '@/constants';

export default {
	namespaced: true,

	state: {
		dndEnabled: false,
		showHorizontalLine: false,
		showVerticalLine: false,
		boundaryIndicators: {
			top: false,
			bottom: false,
			left: false,
			right: false
		},
		gridCols: GRID_COLS,
		gridRows: GRID_ROWS
	},

	getters: {
		shownBoundaryIndicators: state => {
			return Object.keys(state.boundaryIndicators).filter(key => {
				return state.boundaryIndicators[key];
			})
		}
	},

	mutations: {
		toggleDnd(state) {
			state.dndEnabled = !state.dndEnabled;
		},
		showHorizontalLine(state, value) {
			state.showHorizontalLine = value;
		},
		showVerticalLine(state, value) {
			state.showVerticalLine = value;
		},
		setBoundaryIndicators(state, sides) {
			state.boundaryIndicators = { ...sides };
		}
	},

	actions: {

	}

}