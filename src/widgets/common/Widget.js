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

		// TODO: create class for displaySettings
		// this.displaySettings = displaySettings;
		
		this.setupComplete = false;
	}

	loadStore() {
		if (!this.setupComplete) {
			this.widgetStore.init();
		}
		return this;
	}
	
	getComponent() {
		const c = this.loadStore().component;
		return Promise.resolve(c);
	}
}