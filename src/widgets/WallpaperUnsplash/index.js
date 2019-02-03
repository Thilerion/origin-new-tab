import registerAndPersistModule from '@/utils/persistModule.js';

import storeModule from './store';
import component from './main.vue';

const reducer = (state, getters) => {
	return {
		data: state.unsplash.data,
		expires: state.unsplash.expires
	};
}

registerAndPersistModule(storeModule, 'unsplash', 'sp_unsplash', reducer);

export default component;