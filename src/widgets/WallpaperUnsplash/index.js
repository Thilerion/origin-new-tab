import store from '@/store';

import storeModule from './store';
import component from './main.vue';

if (store.state.unsplash) {
	console.log("Unsplash module is already registered");
} else {
	console.log("Registering unsplash module...");
	store.registerModule('unsplash', storeModule);
}

export default component;