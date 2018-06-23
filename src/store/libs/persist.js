import debounce from 'lodash.debounce';

function createPersistedState(storagePrefix = "sp_", widgets = []) {
	// save to store: [widgetName]Set
	// no data in store: [widgetName]StorageLoadFailed
	// expired: [widgetName]StorageLoadExpired

	const toWatch = (val) => (state, getters) => getters[`${val}Watch`];

	const watchCallback = (val) => debounce((newValue, oldValue) => {
		console.log(`Watcher is triggered for module '${val}'.`);
		saveToStorage(val, newValue);
	}, 500, {maxWait: 10000});

	function createWatcher(store, val) {
		console.log(`Creating watcher for '${val}'.`);

		store.watch(toWatch(val), watchCallback(val), { deep: true });
	}

	function createResetStorage(widgets) {
		return function resetStorage() {
			widgets.forEach(w => {
				window.localStorage.removeItem(`${storagePrefix}${w}`);
				console.warn("Removed localStorage item", w);
			})			
		}		
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
		// return true;
		return expiryDate - new Date().getTime() < 0;
	}

	return function persistState(store) {
		store.resetAllStorage = createResetStorage(widgets);

		widgets.forEach(widget => {
			createWatcher(store, widget)
			store[`${widget}FromStorage`] = createLoadFromStorage(widget);
			
			let data = store[`${widget}FromStorage`]();
			if (!data) {
				//no data: [widgetName]StorageLoadFailed
				store.dispatch(`${widget}/${widget}StorageLoadFailed`);
			} else if (data.expires && isExpired(data.expires)) {
				//expired: [widgetName]StorageLoadExpired
				store.dispatch(`${widget}/${widget}StorageLoadExpired`, data);
			} else {
				//everything ok: [widgetName]SetFromStorage
				store.dispatch(`${widget}/${widget}SetFromStorage`, data);
			}
		});
	}
}

export default createPersistedState;