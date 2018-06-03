//PERSISTED STATE

//propertyToWatch: [moduleName]Watch
//dispatch to save: [moduleName]Set
//dispatch if fail: [moduleName]LoadFailed

function createWatcher(store, val) {
	console.log("Now creating watcher for ", val);
	store.watch((state, getters) => getters[`${val}Watch`], (newValue, oldValue) => {
		const stringifiedValue = JSON.parse(JSON.stringify(newValue));
		console.log(`Watcher is triggered for module ${val}, with value: `, stringifiedValue);
		saveToStorage(val, stringifiedValue);
	}, { deep: true });
}

const initWatchers = (store, widgets = []) => {
	console.log("INITIALIZING WATCHERS", "Widgets to watch: ", widgets);

	widgets.forEach((val) => createWatcher(store, val));
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