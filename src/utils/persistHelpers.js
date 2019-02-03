import _debounce from 'lodash.debounce';
import store from '@/store/index.js';

export const registerModule = (storeName, storeModule) => { 
	if (store.state[storeName]) {
		console.warn(`StoreModule for "${storeName}" is already registered.`);
		return;
	}

	store.registerModule(storeName, storeModule);
	console.log(`StoreModule has been registered for "${storeName}".`);
};

export const watchModule = (
	reducerFn,
	watcherCallback,
	options = {},
	debounceOpts = {}
) => {
	const { deep = true, moduleName } = options;
	const { wait = 500, leading = false, maxWait = 10000, trailing = true } = debounceOpts;
	
	const debouncedCb = _debounce(
		watcherCallback,
		wait,
		{ maxWait, leading, trailing }
	);
	
	store.watch(
		reducerFn,
		debouncedCb,
		{ deep }
	);

	if (moduleName) {
		console.log(`Store watcher created for module "${moduleName}".`);
	} else {
		console.log(`Store watcher created.`);
	}
}