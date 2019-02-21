import { ALGOLIA_APP_ID as appId, ALGOLIA_SEARCH_KEY as apiKey } from '@/constants';

import places from 'places.js';

const initPlaces = (el, options = {}) => {
	const placesAutocomplete = places({
		appId,
		apiKey,
		container: el,
		...options
	});
	return placesAutocomplete;
};

export default initPlaces;