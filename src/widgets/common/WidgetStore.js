export default class WidgetModule {
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
	validateData(toValidate = {}) {
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
				return { validatedData: this.dataDefaultValues, defaultUsedFor: this.dataKeys };
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

		return { validatedData, defaultUsedFor };
	}
}