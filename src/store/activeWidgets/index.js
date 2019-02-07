import { getFromStorage, saveToStorage } from '@/utils/lsHelpers';
import { validateActiveWidgets } from './validateActiveWidgets';

const STORAGE_KEY = 'sp_activeWidgets';

const savedState = getFromStorage(STORAGE_KEY);
let validatedState = validateActiveWidgets(savedState);

saveToStorage(STORAGE_KEY, validatedState);

const activeWidgetsModule = {
	namespaced: false,

	state: {
		...validatedState
	},

	getters: {

	},

	mutations: {

	},

	actions: {

	}
}

export default activeWidgetsModule;