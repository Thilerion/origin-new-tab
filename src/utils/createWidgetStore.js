import { persistModule, registerModule } from '@/utils/storeModuleHelpers';
import { getFromStorage } from '@/utils/lsHelpers';
import _merge from 'lodash.merge';

function mergeStoreData(dataDefaults, key) {
	const storageData = getFromStorage(key) || {};
	
	const { expires = dataDefaults.expires, data: localData } = storageData;

	const validatedData = {};

	for (const key in dataDefaults) {
		validatedData[key] = (localData && localData[key]) || dataDefaults[key];
	}

	return {
		state: {
			data: { ...validatedData },
			expires
		}
	};
}

function createWidgetStore(baseStore, toMerge, storeName, storeKey, reducerFn) {
	const mergedState = { ...baseStore.state, ...toMerge.state };
	const mergedStore = _merge(baseStore, { state: { ...mergedState } });

	const register = registerModule(storeName, mergedStore);
	const persist = persistModule(
		reducerFn,
		storeName,
		storeKey,
		{ deep: true, immediate: true, wait: 500, maxWait: 10000 }
	);

	return { register, persist };
}

export { mergeStoreData, createWidgetStore };