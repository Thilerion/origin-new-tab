import { ApiRequest } from '../common/api.service.js';

/**
 * Create state with loadApiData and expiring data functionality
 * @param data Default data OR localStorage merged data
 */
const createBaseState = ({
	data,
	expires = null
}) => ({
	data,
	expires,

	finishedLoading: false,
	dataHasLoaded: false
});

/**
 * Create getters for the above base state,
 * along with params for the apiRequest and a checker
 * for if localStorageData was succesfully loaded. 
 */
const createBaseGetters = ({
	apiRequestParams,
	hasLocalStorageData
}) => ({
	hasExpired: state => (state.expires - Date.now() < 0),

	showComponent(state) {
		return state.finishedLoading && state.dataHasLoaded;
	},
	errorLoading(state) {
		return state.finishedLoading && !state.dataHasLoaded;
	},

	apiRequestParams,
	hasLocalStorageData,	
});

/**
 * Create mutations for the above state,
 * along with a custom setData mutation for setting data from the api
 */
const createBaseMutations = ({
	setData
}) => ({
	setExpires(state, time) {
		state.expires = time;
	},
	setFinishedLoading(state, bool) {
		state.finishedLoading = bool;
	},
	setDataHasLoaded(state, bool) {
		state.dataHasLoaded = bool;
	},
	setData,
});

/**
 * Create actions which include init (called from component beforeCreate)
 * fetchApiData which uses the apiRequestParams getters
 * A custom finishInit can be set
 * A custom setApiData can be set (which would probably commit the setData mutation)
 */
const createBaseActions = ({
	finishInit,
	setApiData
}) => ({
	/**
	 * Called by component, initiating a fetch or not
	**/
	async init({ getters, dispatch }) {
		let hasFetched,
			hasData;
	
		const hasLocalStorageData = getters.hasLocalStorageData;
		const expired = getters.hasExpired;
	
		if (hasLocalStorageData) {
			if (expired) {
				hasFetched = await dispatch('fetchApiData');
			} else if (!expired) {
				hasFetched = true;
			}
			hasData = true;
		} else {
			hasFetched = await dispatch('fetchApiData');
			if (hasFetched) {
				hasData = true;
			} else {
				hasData = false;
			}
		}
		dispatch('finishInit', await hasData);
	},
	async fetchApiData({ dispatch }) {
		try {
			const response = await dispatch('makeRequest');
			const { data, expires } = response;
			dispatch('setApiData', { data, expires });
		} catch (e) {
			return false;
		}
	},
	makeRequest({ getters }) {
		return ApiRequest(...getters.apiRequestParams);
	},
	/**
	 * Called by init() action, to set the finishedLoading and dataHasLoaded things
	**/
	finishInit,
	setApiData
});

export { createBaseState, createBaseGetters, createBaseMutations, createBaseActions };