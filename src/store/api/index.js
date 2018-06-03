//PERSISTED STATE

//propertyToWatch: [moduleName]Watch
//dispatch to save: [moduleName]Set
//dispatch if fail: [moduleName]LoadFailed

const initWatchers = (store) => {
	console.log("INITIALIZING WATCHERS");
	store.watch((state, getters) => getters.wallpaperWatch, (newValue, oldValue) => {
		console.log("WATCHER: ", {...newValue});
		saveToStorage('wallpaper', { ...newValue });
	}, {deep: true});
	
	store.watch((state, getters) => getters.userWatch, (newValue, oldValue) => {
		console.log("WATCHER: ", newValue);
		saveToStorage('user', newValue);
	}, { deep: true });
	
	store.watch((state, getters) => getters.quoteWatch, (newValue, oldValue) => {
		console.log("WATCHER: ", newValue);
		saveToStorage('quote', newValue);
	}, { deep: true });
	
	store.watch((state, getters) => getters.weatherWatch, (newValue, oldValue) => {
		console.log("WATCHER: ", newValue);
		saveToStorage('weather', newValue);
	}, { deep: true });
	
	store.watch((state, getters) => getters.newsWatch, (newValue, oldValue) => {
		console.log("WATCHER: ", newValue);
		saveToStorage('news', newValue);
	}, {deep: true});
}

const saveToStorage = (moduleName, data) => {
	const key = `sp_${moduleName}`;
	window.localStorage.setItem(key, JSON.stringify(data));
}

const loadFromStorage = (moduleName) => {
	const key = `sp_${moduleName}`;
	const retrieved = window.localStorage.getItem(key);
	if (retrieved) {
		return JSON.parse(retrieved);
	} else {
		return null;
	}
}

export { initWatchers, loadFromStorage };