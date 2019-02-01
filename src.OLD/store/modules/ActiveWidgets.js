export default {
	namespaced: true,

	state: {
		widgets: []
	},

	getters: {
		widgets: state => state.widgets,
		widgetByIndex: state => index => state.widgets[index],
		widgetByName: state => name => state.widgets.find(w => w.name === name),
		widgetIndexByName: state => name => state.widgets.findIndex(w => w.name === name)
	},

	mutations: {
		setWidgets(state, widgets) {
			state.widgets = [...widgets];
		},
		setWidgetActive(state, { name, active }) {
			state.widgets.find(w => w.name === name).active = active;
		},
		setWidgetPositionOnGrid(state, { index, moveCols, moveRows }) {
			let row = [...state.widgets[index].row];
			let col = [...state.widgets[index].column];
			if (!!moveRows) {
				row = row.map(n => n += moveRows);
			}
			if (!!moveCols) {
				col = col.map(n => n += moveCols);
			}
			state.widgets[index].column = [...col];
			state.widgets[index].row = [...row];
		},
		setWidgetSizeOnGrid(state, { index, cols, rows }) {
			state.widgets[index].column = [...cols];
			state.widgets[index].row = [...rows];
		},
		changeWidgetFontSize(state, { index, amount }) {
			state.widgets[index].fontSize += amount;
		},
		setWidgetAlignment(state, { index, alignment }) {
			state.widgets[index].align = alignment;
		},
		setWidgetVerticalAlignment(state, { index, alignment }) {
			state.widgets[index].vAlign = alignment;
		}
	},

	actions: {
		changeWidgetFontSize({ getters, commit }, { name, value }) {
			const index = getters.widgetIndexByName(name);
			commit('changeWidgetFontSize', { index, amount: value });
		},
	
		changeWidgetAlignment({ getters, commit }, { name, alignment }) {
			const index = getters.widgetIndexByName(name);
			commit('setWidgetAlignment', {index, alignment})
		},
	
		changeWidgetVerticalAlignment({ getters, commit }, { name, alignment }) {
			const index = getters.widgetIndexByName(name);
			commit('setWidgetVerticalAlignment', {index, alignment})
		},
	
		moveWidget({ getters, commit }, { name, moveCols = 0, moveRows = 0 }) {
			commit('setWidgetPositionOnGrid', {
				index: getters.widgetIndexByName(name),
				moveCols,
				moveRows
			});
		},
		resizeWidget({ getters, commit }, { name, cols, rows }) {
			commit('setWidgetSizeOnGrid', {
				index: getters.widgetIndexByName(name),
				cols,
				rows
			})
		}
	}
}