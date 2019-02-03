import WidgetStore from "./WidgetStore";

export default class Widget {
	constructor({
		name,
		type,
		settings,
		moduleDataReducer,
		moduleData
	}, component, storeModule) {
		this.name = name;
		this.type = type; // 'background' or 'grid' widgets

		this.component = component;

		this.widgetStore = new WidgetStore({
			hasApi: true,
			shouldPersistStore: true,
			persistReducer: moduleDataReducer,
			widgetStore: storeModule,
			widgetStoreName: name,
			widgetModuleDataConfig: moduleData
		})

		// TODO: create class for creating settings, defaults, validating
		this.settings = settings;
		
		this.setupComplete = false;
	}

	loadStore() {
		this.widgetStore.init();
		return this;
	}
	
	getComponent() {
		return this.loadStore().component;
	}
}