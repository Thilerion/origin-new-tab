import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import { persistModule } from '@/utils/storeModuleHelpers';

import { settingsModule, STORAGE_KEY as settingsStorageKey } from './settings';
import { gridModule, STORAGE_KEY as gridStorageKey } from './grid';

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'development',

	plugins: [
		persistModule(
			(state) => ({ ...state.settings }),
			'settings',
			settingsStorageKey,
			{ deep: true, wait: 500, maxWait: 10000, immediate: true }
		),
		persistModule(
			(state) => ({ wallpaperWidget: state.grid.wallpaperWidget, gridWidgets: state.grid.gridWidgets, gridOrder: state.grid.gridOrder }),
			'grid',
			gridStorageKey,
			{ deep: true, wait: 1000, maxWait: 10000, immediate: false }
		)
	],

	modules: {
		settings: settingsModule,
		grid: gridModule
	},

	state: {
		showSettingsOverlay: false,
		editingGrid: false,
		dragAddNewWidget: {
			dragging: false,
			type: '',
			width: null,
			height: null
		}
	},

	getters: {
		enableNewWidgetDropzone: state => state.dragAddNewWidget.dragging
	},

	mutations: {		
		setShowSettingsOverlay(state, show) {
			if (show == null) {
				state.showSettingsOverlay = !state.showSettingsOverlay;
			} else {
				state.showSettingsOverlay = show;
			}
		},
		setEditingGrid(state, editing) {
			if (editing == null) {
				state.editingGrid = !state.editingGrid;
			} else {
				state.editingGrid = editing;
			}
		},
		initNewWidgetDrag(state, { widget, width, height }) {
			console.log('init new widget drag');
			state.dragAddNewWidget = {
				dragging: true,
				type: widget,
				width,
				height
			}
		},
		stopNewWidgetDrag(state) {
			state.dragAddNewWidget = {
				dragging: false,
				type: '',
				width: null,
				height: null
			};
		}
	},

	actions: {
		
	}
});

export default store;