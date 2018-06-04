function createPersistedState(storagePrefix = "sp_", widgets = []) {
	// save to store: [widgetName]Set
	// no data in store: [widgetName]StorageLoadFailed
	// expired: [widgetName]StorageLoadExpired

	function createWatcher(store, val) {
		console.log("Now creating watcher for ", val);
		store.watch((state, getters) => getters[`${val}Watch`], (newValue, oldValue) => {
			const stringifiedValue = JSON.parse(JSON.stringify(newValue));
			console.log(`Watcher is triggered for module ${val}, with value: `, stringifiedValue);
			saveToStorage(val, stringifiedValue);
		}, { deep: true });
	}

	function saveToStorage(widget, data) {
		const key = `${storagePrefix}${widget}`;
		window.localStorage.setItem(key, JSON.stringify(data));
	}

	function createLoadFromStorage(widget) {
		return function loadFromStorage() {
			const key = `${storagePrefix}${widget}`;
			const data = window.localStorage.getItem(key);
			if (data) return JSON.parse(data);
			return null;
		}		
	}

	function isExpired(expiryDate) {
		return expiryDate - new Date().getTime() < 0;
	}

	return function persistState(store) {
		widgets.forEach(widget => {
			createWatcher(store, widget)
			store[`${widget}FromStorage`] = createLoadFromStorage(widget);
			
			let data = store[`${widget}FromStorage`]();
			if (!data) {
				//no data: [widgetName]StorageLoadFailed
				store.dispatch(`${widget}StorageLoadFailed`);
			} else if (data.expires && isExpired(data.expires)) {
				//expired: [widgetName]StorageLoadExpired
				store.dispatch(`${widget}StorageLoadExpired`, data);
			} else {
				//everything ok: [widgetName]Set
				store.dispatch(`${widget}Set`, data);
			}
		});
	}
}

export default createPersistedState;