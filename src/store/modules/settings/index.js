// App helper functions
import { saveToStorage } from '@/utils/lsHelpers';
import _debounce from 'lodash.debounce';

import { validatedData } from './config';

const settingsModule = {
	namespaced: false,

	state: {
		...validatedData
	},

	getters: {

	},

	mutations: {

	},

	actions: {

	}
}

const settingsPersistPlugin = store => {
	const reducerFn = state => (state.settings);
	const watchCb = (newValue, oldValue) => {
		console.log(`Watcher is triggered for "settings" module.`);
		saveToStorage('sp_settings', newValue);
	}
	const debouncedCb = _debounce(
		watchCb,
		500,
		{ maxWait: 10000 }
	);

	store.watch(
		reducerFn,
		debouncedCb,
		{ deep: true }
	);

	console.log('Store watcher created for "SETTINGS" module, by plugin.');
};

export { settingsModule, settingsPersistPlugin };