import _debounce from 'lodash.debounce';
import { saveToStorage } from '@/utils/storage';

const persistModule = (
	reducerFn,
	moduleName,
	storageKey,
	options = {}
) => {
	const {
		deep = true,
		immediate = true,
		wait = 500,
		maxWait = 10000
	} = options;

	const callback = _debounce(newValue => {
		console.log(`[PersistModule]: changes in "${moduleName}".`);
		saveToStorage(storageKey, newValue);
	}, wait, { maxWait });

	return store => {
		// console.log(`[PersistModule]: created watcher from "${moduleName}".`);
		return store.watch(reducerFn, callback, { deep, immediate });
	}
}

const registerModule = (moduleName, storeModule) => {
	return store => {
		if (!store || !store.state) {
			console.error(`[RegisterModule]: Store doesn't exist, can't register module "${moduleName}".`);
			return false;
		} else if (store.state[moduleName]) {
			console.warn(`[RegisterModule]: Module "${moduleName}" already exists in store.`);
			return false;
		} else {
			store.registerModule(moduleName, storeModule);
			console.log(`[RegisterModule]: Module "${moduleName}" has succesfully been registered to the store.`);
			return true;
		}
	}
}

export { persistModule, registerModule };