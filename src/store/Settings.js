const settingsStore = {

	state: {

	},

	getters: {
		currentSettings(state, getters) {
			let activeWidgetsStore = getters.activeWidgets;
			let copiedWidgets = [...activeWidgetsStore].map(w => {
				return { ...w };
			})
			return {
				name: getters.username,
				language: getters.language,
				fontSize: getters.fontSize,
				wallpaperCollection: getters.wallpaperCollection,
				quoteCategory: getters.quoteCategory,
				activeWidgets: copiedWidgets
			}
		} 
	},

	mutations: {

	},

	actions: {
		saveSettings({ commit, dispatch }, { name, language, fontSize, wallpaperCollection, quoteCategory, activeWidgets }) {
			if (name) commit('setUsername', name);			
			if (language) commit('setLanguage', language);
			if (fontSize !== undefined) commit('setFontSize', fontSize);
			if (wallpaperCollection) dispatch('setWallpaperCollection', wallpaperCollection);
			if (quoteCategory) commit('setQuoteCategory', quoteCategory);
			if (activeWidgets) commit('setActiveWidgets', activeWidgets);
		} 
	}

}

export default settingsStore;