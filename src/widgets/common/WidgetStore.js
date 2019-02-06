// External helper functions
import _merge from 'lodash.merge';

// App helper functions
import { loadFromStorage, saveToStorage } from '@/utils/lsHelpers';
import { registerModule, watchModule } from '@/utils/persistHelpers';

// Validation class
import { ERR_REQUIRED, default as Validator } from '@/utils/validate.js';

export default class WidgetStore {
	constructor({
		//shouldPersistStore,
		//hasApi,
		persistReducer,
		widgetStore,
		widgetStoreName,
		widgetModuleDataConfig
	}) {
		this.store = widgetStore;
		this.storeName = widgetStoreName;

		this.storeDataHelper = new Validator(widgetModuleDataConfig);

		this.shouldPersistStore = true;
		this.hasApi = true;
		this.persistReducer = persistReducer;
	}

	get storageKey() {
		return `sp_${this.storeName}`;
	}

	/**
	 * Retrieves {data, expires} from localStorage
	 * Validates data, settings default values if necessary
	 * Checks if data was loaded (if not, the module will fetch new data)
	 * Registers store and sets up a watcher
	 */
	init() {
		let data;
		let expires = null;

		const storageData = this.getStored();
		if (storageData && storageData.data) {
			data = storageData.data;
			if (storageData.expires) {
				expires = storageData.expires;
			}
		}

		// now the data and expires objects are set and we can validate
		let validatedData = this.storeDataHelper.validate(data);
		let validateError = this.storeDataHelper.error;

		let dataWasFound = !(validateError && validateError === ERR_REQUIRED);
		// merge state with new data
		const mergedState = this.getMergedState(validatedData, expires, dataWasFound);

		// merge the entire store module
		const mergedStore = this.getMergedStore(mergedState);

		// REGISTER STORE
		registerModule(this.storeName, mergedStore);

		// SETUP STORE WATCHER
		const reducer = this.persistReducer;
		const watchCb = (newValue) => {
			console.log(`Watcher is triggered for module ${this.storeName}.`);
			saveToStorage(this.storageKey, newValue);
		}
		
		watchModule(
			reducer,
			watchCb,
			{ deep: true, moduleName: this.storeName },
			{ maxWait: 10000 }
		);
	}

	getStored() {
		return loadFromStorage(this.storageKey);
	}

	getMergedState(data, expires, hasLocalStorageData = false) {
		const baseState = this.store.state;
		const toMergeState = {
			data,
			expires,
			hasLocalStorageData
		};
		return { ...baseState, ...toMergeState };
	}

	getMergedStore(state) {
		const storeToMerge = { state };
		return _merge(this.store, storeToMerge);
	}
}