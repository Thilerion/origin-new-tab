import {
	mergeStoreData,
	createWidgetStore
} from '@/utils/createWidgetStore';

import getLocation from '@/utils/geolocation.js';
import { ApiRequest } from '../common/api.service';

const STORE_NAME = 'weather';
const STORAGE_KEY = 'sp_weather';

const storeDataDefaults = {
	forecast: {
		currently: {},
		daily: []
	},
	position: {
		latitude: null,
		longitude: null,
		address: {
			formattedAddress: '',
			city: '',
			country: ''
		}
	}
}

const mergedState = mergeStoreData(storeDataDefaults, STORAGE_KEY);
const { data, expires } = mergedState;

const store = {
	namespaced: true,
	state: {
		// CUSTOM MIXINS
		data,
		expires,

		// DEFAULTS
		finishedLoading: false,
		dataHasLoaded: false,

		// FULLY CUSTOM
	},
	getters: {
		hasExpired: state => (state.expires - Date.now() < 0),

		showComponent(state) {
			return state.finishedLoading && state.dataHasLoaded;
		},
		errorLoading(state) {
			return state.finishedLoading && !state.dataHasLoaded;
		},
		
		// CUSTOM MIXINS
		apiRequestParams(state, getters, rState) {
			const lang = rState.settings.general.language;
			const units = rState.settings.weather.units || 'ca';
			const { latitude, longitude } = state.data.position;
			if (!lang || !units || !latitude || !longitude) {
				console.warn('Error in weather apiRequestParams', { lang, units, latitude, longitude });
			}
			return [
				'weather',
				`v2/weather`,
				{ lang, units, latitude, longitude }
			];
		},
		hasLocalStorageData(state) {
			try {
				const hasForecast = state.data.forecast && state.data.forecast.currently && state.data.forecast.daily && state.data.forecast.daily.length > 0;

				const hasPosition = state.data.position.latitude != null && state.data.position.longitude != null;

				return hasForecast && hasPosition;
			} catch (e) {
				return false;
			}			
		},	
		// FULLY CUSTOM

		hasCoordinates(state) {
			return state.data.position.latitude != null && state.data.position.longitude != null;
		},
		useCustomLocation(state, getters, rState) {
			return rState.settings.weather.useCustomLocation;
		},
		customCoordinates(state, getters, rState) {
			const { latitude, longitude } = rState.settings.weather.customLocation;
			return { latitude, longitude };
		}

	},
	mutations: {
		setExpires(state, time) {
			state.expires = time;
		},
		setFinishedLoading(state, bool) {
			state.finishedLoading = bool;
		},
		setDataHasLoaded(state, bool) {
			state.dataHasLoaded = bool;
		},

		// CUSTOM MIXINS
		// setData(state, data) {

		// },

		// FULLY CUSTOM
		setLocation(state, { latitude, longitude }) {
			console.log("Setting location", { latitude, longitude });
			state.data.position.latitude = latitude;
			state.data.position.longitude = longitude;
		},
		setForecast(state, forecast) {
			state.data.forecast = { ...forecast };
		},
		setAddress(state, address) {
			state.data.position.address = { ...address };
		}
	},
	actions: {
		async init({ state, getters, commit, dispatch }) {
			const useCustomLocation = getters.customCoordinates;
			console.log(useCustomLocation);
			const curLocation = await dispatch('getCoordinates');

			const foundCurLocation = curLocation && curLocation.latitude != null;
			const hasLocalStorageData = getters.hasLocalStorageData;

			let shouldSetNewLocation = false;
			let shouldFetch = false;
			let hasData = false;

			if (hasLocalStorageData && !foundCurLocation) {
				// old data, but set it anyway
				hasData = true;
				shouldFetch = false;

			} else if (hasLocalStorageData && foundCurLocation) {
				const freshData = !getters.hasExpired;
				const sameLocation = curLocation.latitude === state.data.position.latitude && curLocation.longitude === state.data.position.longitude;
				
				if (!freshData || !sameLocation) {
					// set new location
					// fetch new data, but if it fails set the old data anyway
					shouldSetNewLocation = true;
					shouldFetch = true;
					hasData = true;
				} else {
					// finish; data is good
					hasData = true;
				}
			} else if (!hasLocalStorageData && !foundCurLocation) {
				// no data, error
				hasData = false;
			} else if (!hasLocalStorageData && foundCurLocation) {
				// set new location
				// fetch new data, if it fails show error, if it succeeds set good data
				shouldSetNewLocation = true;
				shouldFetch = true;
			}

			if (shouldSetNewLocation) {
				commit('setLocation', curLocation);
			}
			if (shouldFetch && hasData) {
				// if fetch fails, ok, if fetch succeeds, ok
				await dispatch('fetchApiData');
			} else if (shouldFetch && !hasData) {
				// if fetch fails, show error
				// if fetch succeeds, all good
				const succeeded = await dispatch('fetchApiData');
				if (succeeded) hasData = true;
			}
			dispatch('finishInit', hasData);
		},
		async fetchApiData({ dispatch }) {
			try {
				const response = await dispatch('makeRequest');
				const { data, expires } = response;
				dispatch('setApiData', { data, expires });
				return true;
			} catch (e) {
				return false;
			}
		},
		makeRequest({ getters }) {
			return ApiRequest(...getters.apiRequestParams);
		},

		// CUSTOM MIXINS
		finishInit({commit}, success) {
			commit('setDataHasLoaded', !!success);
			commit('setFinishedLoading', true);
		},
		setApiData({ commit }, { data, expires }) {
			console.log({ ...data });
			commit('setForecast', data.forecast);
			commit('setAddress', data.address);
			commit('setExpires', expires);
		},

		// FULLY CUSTOM
		async getCoordinates({ }) {
			const coordinates = await getLocation();
			return coordinates;
		}
	}
}

const { register, persist } = createWidgetStore(
	store,
	STORE_NAME,
	STORAGE_KEY,
	(state) => ({
		data: state[STORE_NAME].data,
		expires: state[STORE_NAME].expires
	})
)

export { register, persist };