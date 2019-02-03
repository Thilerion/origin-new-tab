import registerAndPersistModule from '@/utils/persistModule.js';

import storeModule from './store';
import component from './main.vue';
import validateStorageData from '../common/validateStorage.service.js';
import { config } from './settings.js';

const reducer = (state) => {
	return {
		data: state.unsplash.data,
		expires: state.unsplash.expires
	};
}

// TODO: should only register if component is loaded...
const { hasPrevState, prevState } = registerAndPersistModule(storeModule, 'unsplash', 'sp_unsplash', reducer);

debugger;

if (hasPrevState) {
	// validate hydrated data
	// check if expired
	const expired = hasExpired(prevState.expires);
	const { validatedData, errors } = validateStorageData(prevState.data, config);

	console.log({ expired, validatedData, errors });
	// if expired => dispatch('fetchApiData', {prevState, force: false});
	// if not expired => dispatch('completeInit');
	// if invalid data => dispatch('fetchApiData', {force: true});
}

function hasExpired(expires) {
	return (expires - Date.now() < 0);
}

export default component;