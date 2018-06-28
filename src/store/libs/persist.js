import debounce from 'lodash.debounce';

function createPersistedState(storagePrefix = "sp_", widgets = []) {
	const toWatch = (moduleName, namespaced) => {
		let moduleGetter = namespaced ? `${moduleName}/toWatch` : `${moduleName}ToWatch`;
		console.warn(`Watch getter for ${moduleName} is getters[${moduleGetter}]`);
		return (state, getters) => getters[moduleGetter];
	};

	const moduleDataChanged = moduleName => debounce((newValue, _) => {
		console.log(`Watcher is triggered for module '${moduleName}'.`);
		saveToStorage(moduleName, newValue);
	}, 500, { maxWait: 10000 });

	const saveToStorage = (moduleName, data) => {
		const key = `${storagePrefix}${moduleName}`;
		window.localStorage.setItem(key, JSON.stringify(data));	
	}

	const loadFromStorage = moduleName => {
		const key = `${storagePrefix}${moduleName}`;
		const data = window.localStorage.getItem(key);
		if (data) return JSON.parse(data);
		else return null;
	}

	const resetStorage = moduleName => {
		window.localStorage.removeItem(`${storagePrefix}${moduleName}`);
		console.warn("Removed localStorage item", moduleName);
	}

	const createResetAllStorage = (widgets = []) => () => {
		console.warn("Creating a remove all localStorage function.");
		resetStorage('settings');
		widgets.forEach(resetStorage);
	}

	const createWatcher = (store, moduleName, namespaced) => {
		console.log(`Creating watcher for '${moduleName}'.`);
		store.watch(toWatch(moduleName, namespaced), moduleDataChanged(moduleName), { deep: true });
	}

	function initializeModulePersistence(store, moduleName, namespaced = true) {
		return function () {
			//Initializing ${moduleName} watcher
			createWatcher(store, moduleName, namespaced);

			//Loading ${moduleName} storage data
			const storageData = loadFromStorage(moduleName);

			//Dispatching ${moduleName} storage data to module
			if (!storageData) {
				let action = `${moduleName}/storageLoadFail`;
				if (!namespaced) action = `${moduleName}StorageLoadFail`;
				store.dispatch(action);
			}
			else {
				let action = `${moduleName}/storageLoadSuccess`;
				if (!namespaced) action = `${moduleName}StorageLoadSuccess`;
				store.dispatch(action, storageData);
			}
		}
	}

	return function persistStatePlugin(store) {
		initializeModulePersistence(store, 'settings', false)();
		initializeModulePersistence(store, 'wallpaper')();
		// initializeModulePersistence(store)

		store.initializeWidget = {};

		widgets.forEach(w => {
			store.initializeWidget[w] = initializeModulePersistence(store, w);
			// initializeModulePersistence(store, w)
		});

		console.log(store);

		store.resetAllStorage = createResetAllStorage(widgets);
	}
}


/*
function createPersistedState2(storagePrefix = "sp_", widgets = []) {
	// save to store: [widgetName]Set
	// no data in store: [widgetName]StorageLoadFailed
	// expired: [widgetName]StorageLoadExpired

	const toWatch = (val) => (state, getters) => getters[`${val}/${val}Watch`];

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
		store.resetAllStorage = createResetStorage(['settings', ...widgets]);

		console.log(`Creating watcher for 'settings'.`);
		store.watch((state, getters) => getters.settingsWatch, watchCallback('settings'), { deep: true });
		store.settingsFromStorage = createLoadFromStorage('settings');
		let data = store.settingsFromStorage();
		if (!data) {
			store.dispatch(`settingsStorageLoadFailed`);
		} else if (data.expires && isExpired(data.expires)) {
			//expired: [widgetName]StorageLoadExpired
			store.dispatch(`settingsStorageLoadExpired`, data);
		} else {
			//everything ok: [widgetName]SetFromStorage
			store.dispatch(`settingsSetFromStorage`, data);
		}

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
}*/

export default createPersistedState;