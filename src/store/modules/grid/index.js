import { GRID_ROWS, GRID_COLS, WIDGET_TYPE_BG, WIDGET_TYPE_GRID } from '@/constants.js';

export const gridModule = {
	namespaced: true,

	state: {
		rows: GRID_ROWS,
		cols: GRID_COLS,
		activeWidgets: [
			{
				type: WIDGET_TYPE_BG,
				name: 'WallpaperUnsplash'
			},
		]
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

}