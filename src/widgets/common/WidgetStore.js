// External helper functions
import _merge from 'lodash.merge';

// App helper functions
import { loadFromStorage, saveToStorage } from '@/utils/lsHelpers';
import { registerModule, watchModule } from '@/utils/persistHelpers';

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

		this.storeDataHelper = new WidgetModuleData(widgetModuleDataConfig);

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
		let data = {};
		let expires = null;

		const storageData = this.getStored();
		if (storageData && storageData.data) {
			data = storageData.data;
			if (storageData.expires) {
				expires = storageData.expires;
			}
		}

		// now the data and expires objects are set and we can validate
		const {
			defaultUsedFor,
			validatedData,
			dataWasFound
		} = this.storeDataHelper.validate(data);

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

class WidgetModuleData {
	constructor(config) {
		this.moduleData = config;
	}

	get dataKeys() {
		return Object.keys(this.moduleData);
	}

	get dataEntries() {
		return Object.entries(this.moduleData);
	}

	get dataDefaultValues() {
		const defaultData = {};
		this.dataEntries.forEach(([key, val]) => {
			defaultData[key] = val.defaultValue(this.moduleData);
		})
		return defaultData;
	}

	// Returns {validatedData: either all defaults, or the validatedData}
	// Return {defaultUsedFor: values for which the defaultValues were used}
	validate(toValidate = {}) {
		const defaultUsedFor = [];
		const validatedData = {};
		
		if (toValidate.state || toValidate.data) {
			console.error("ValidateDate should receive the 'data' object from the store state.");
			return;
		}

		for (const [key, val] of this.dataEntries) {
			const propFound = toValidate.hasOwnProperty(key);

			if (!propFound && val.required) {
				console.warn(`Key '${key}' in dataToValidate was not found while it was required. Immediately returning defaultValues now.`);
				return {
					validatedData: this.dataDefaultValues,
					defaultUsedFor: this.dataKeys,
					dataWasFound: false
				};
			} else if (!propFound) {
				// prop not found, use defaultValue
				defaultUsedFor.push(key);
				validatedData[key] = val.defaultValue(toValidate);
			} else if (propFound && !val.validate(toValidate[key], toValidate)) {
				// prop found but not valid, use defaultValue
				defaultUsedFor.push(key);
				validatedData[key] = val.defaultValue(toValidate);
			} else {
				// prop found and was valid, use its current value
				validatedData[key] = toValidate[key];
			}
		}
				
		// check if all required data was found
		// TODO: only set this to false if defaults were used for API data
		let dataWasFound = defaultUsedFor.length === 0;

		return { validatedData, defaultUsedFor, dataWasFound };
	}
}