const settingsStore = {

	state: {

	},

	getters: {
		currentSettings(state, getters) {
			console.log(getters);
			return {
				name: getters.username,
				language: getters.language,
				fontSize: getters.fontSize,
				wallpaperCollection: getters.collection,
				quoteCategory: getters.quoteCategory
			}
		} 
	},

	mutations: {

	},

	actions: {
		saveSettings({ commit, dispatch }, { name, language, fontSize, wallpaperCollection, quoteCategory }) {
			if (name) commit('setUsername', name);			
			if (language) commit('setLanguage', language);
			if (fontSize !== undefined) commit('setFontSize', fontSize);
			if (wallpaperCollection) dispatch('setWallpaperCollection', wallpaperCollection);
			if (quoteCategory) commit('setQuoteCategory', quoteCategory);			
		} 
	}

}

export default settingsStore;