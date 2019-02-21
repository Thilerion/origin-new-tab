import { persistModule, registerModule } from '@/utils/storeModuleHelpers';
import { getFromStorage } from '@/utils/storage';
import _merge from 'lodash.merge';

function mergeStoreData(dataDefaults, key) {
	const storageData = getFromStorage(key) || {};
	
	const { expires = dataDefaults.expires, data: localData } = storageData;

	const validatedData = {};

	for (const key in dataDefaults) {
		validatedData[key] = (localData && localData[key]) || dataDefaults[key];
	}

	return {
		data: { ...validatedData },
		expires
	};
}

function createWidgetStore(baseStore, storeName, storeKey, reducerFn) {
	const register = registerModule(storeName, baseStore);
	const persist = persistModule(
		reducerFn,
		storeName,
		storeKey,
		{ deep: true, immediate: true, wait: 500, maxWait: 10000 }
	);

	return { register, persist };
}

export { mergeStoreData, createWidgetStore };