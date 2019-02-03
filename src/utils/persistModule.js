import store from '@/store/index.js';
import _merge from 'lodash.merge';
import _debounce from 'lodash.debounce';

const modulesPersisted = [];

export default function registerAndPersistModule(storeModule, moduleName, key, reducer) {
	// Don't register module twice (often with live-reload)
	if (modulesPersisted.includes(moduleName)) {
		console.warn(`Persistence already initialized for ${moduleName}. Returning...`);
		return;
	}

	// Load persisted data from previous session
	const prevState = loadFromStorage(key);

	// Gets assigned the hydrated (merged) module, or just the base module if no prevState
	let toRegister;

	if (prevState) {
		toRegister = hydrateModule(storeModule, prevState);
	} else {
		toRegister = storeModule;
	}

	// Register module in store
	registerModule(moduleName, toRegister);

	// Create function that runs whenever module data has changed, that saves to storage again
	const moduleDataChanged = _debounce((newValue) => {
		console.log(`Watcher is triggered for module ${moduleName}.`);
		saveToStorage(key, newValue);
	}, 500, { maxWait: 10000 });

	// Create watcher for the reducer provided by the Widget/Module
	// Run the above function when data changes
	// Watch deep for changes within nested objects
	console.log(`Creating watcher for ${moduleName}`);
	store.watch(
		reducer,
		moduleDataChanged,
		{ deep: true }
	);

	modulesPersisted.push(moduleName);
}

// Merge the baseState and prevState, but only any key that is set on the baseState
function hydrateModule(baseModule, prevState) {
	const base = baseModule.state;
	const merged = {};

	for (const key in base) {
		if (base[key] && prevState[key]) {
			merged[key] = (prevState[key] === undefined ? base[key] : prevState[key]);
		}
	}

	const hydrated = { ...baseModule, state: { ...merged } };
	console.log(hydrated);
	return hydrated;
}

function loadFromStorage(key) {
	const data = window.localStorage.getItem(key);
	if (data) return JSON.parse(data);
	else return false;
}

function saveToStorage(key, data) {
	window.localStorage.setItem(key, JSON.stringify(data));
}

function registerModule(name, storeModule) {
	if (store.state[name]) {
		console.log("Module already registered...");
	} else {
		store.registerModule(name, storeModule);
		console.log(`Module "${name}" has been registered.`);
	}
}