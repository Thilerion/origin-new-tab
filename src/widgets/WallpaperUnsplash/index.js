import storeModule from './store';
import component from './main.vue';
import { config } from './settings.js';

import WidgetStore from '../common/WidgetStore.js';

const widgetStoreHelper = new WidgetStore({
	persistReducer: (state) => ({
		data: state.unsplash.data,
		expires: state.unsplash.expires
	}),
	widgetStore: storeModule,
	widgetStoreName: 'unsplash',
	widgetModuleDataConfig: config.moduleData
});

console.log(widgetStoreHelper);

widgetStoreHelper.init();

import Widget from '../common/Widget.js';

const unsplashWidget = new Widget(config, component, storeModule);
console.log(unsplashWidget);


export default component;