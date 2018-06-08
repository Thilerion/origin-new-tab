const settingsStore = {

	state: {
		dndEnabled: false
	},

	getters: {
		currentSettings(state, getters) {
			let widgetsStore = getters.widgets;
			let copiedWidgets = [...widgetsStore].map(w => {
				return { ...w };
			})
			return {
				name: getters.username,
				language: getters.language,
				fontSize: getters.fontSize,
				wallpaperCollection: getters.wallpaperCollection,
				quoteCategory: getters.quoteCategory,
				widgets: copiedWidgets,
				wallpaperCycleTimeout: getters.wallpaperCycleTimeout
			}
		},
		dndEnabled(state) {
			return state.dndEnabled;
		}
	},

	mutations: {
		toggleDnd(state) {
			state.dndEnabled = !state.dndEnabled;
		}
	},

	actions: {
		saveSettings({ commit, dispatch }, { name, language, fontSize, wallpaperCollection, quoteCategory, widgets, wallpaperCycleTimeout }) {
			if (name) commit('setUsername', name);			
			if (language) commit('setLanguage', language);
			if (fontSize !== undefined) commit('setFontSize', fontSize);
			if (wallpaperCollection) dispatch('setWallpaperCollection', wallpaperCollection);
			if (quoteCategory) commit('setQuoteCategory', quoteCategory);
			if (widgets) commit('setWidgets', widgets);
			if (wallpaperCycleTimeout) commit('setWallpaperCycleTimeout', wallpaperCycleTimeout);
		}
	}

}

export default settingsStore;