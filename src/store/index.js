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
		dragAddNewWidget: {
			dragging: false,
			type: '',
			width: null,
			height: null,
			offsetX: 0,
			offsetY: 0
		},
		ui: {
			showSettings: false,
			showGridEditing: false
		}
	},

	getters: {
		enableNewWidgetDropzone: state => state.dragAddNewWidget.dragging
	},

	mutations: {		
		setShowSettingsOverlay(state, show) {
			if (show == null) {
				state.ui.showSettings = !state.ui.showSettings;
			} else {
				state.ui.showSettings = show;
			}
		},
		setEditingGrid(state, editing) {
			if (editing == null) {
				state.ui.showGridEditing = !state.ui.showGridEditing;
			} else {
				state.ui.showGridEditing = editing;
			}
		},
		initNewWidgetDrag(state, { widget, width, height, offsetX, offsetY }) {
			console.log('init new widget drag');
			state.dragAddNewWidget = {
				dragging: true,
				type: widget,
				width,
				height,
				offsetX,
				offsetY
			}
		},
		stopNewWidgetDrag(state) {
			state.dragAddNewWidget = {
				dragging: false,
				type: '',
				width: null,
				height: null,
				offsetX: 0,
				offsetY: 0
			};
		}
	},

	actions: {
		
	}
});

export default store;