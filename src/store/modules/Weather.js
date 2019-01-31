import { weatherRequest, locationRequest } from '../api/';
import getPosition from '../libs/geolocation';

const widgetName = "weather";

const weatherStore = {
	namespaced: true,

	state: {
		data: {
			forecast: {},
			address: {
				city: null,
				street: null
			},
			coordinates: {
				latitude: null,
				longitude: null
			},
			// TODO: custom coordinates should be in settings
			customCoordinates: {
				latitude: null,
				longitude: null
			}
		},

		expires: null,

		finishedLoading: false,
		dataStatus: null
	},

	getters: {
		toWatch: state => ({ data: state.data, expires: state.expires }),		
		hasExpired: state => (state.expires - Date.now() < 0),

		dataLoadSuccessful: state => state.dataStatus != null && state.finishedLoading,
		dataLoadFailed: state => state.dataStatus === null && state.finishedLoading,


		// TODO: specific function that returns true if the current state.data is not valid
		/*
		dataInvalid: state => {
			specific function here
		},
		*/
		dataInvalid(state) {
			if (state.finishedLoading) return false;

			if (!state.expires) return true;
			if (typeof state.data.address !== 'object') return true;
			if (!state.data.address.city) return true;
			if (typeof state.data.coordinates !== 'object') return true;
			if (!state.data.coordinates.hasOwnProperty('latitude')) return true;
			if (typeof state.data.customCoordinates !== 'object') return true;
			if (!state.data.customCoordinates.hasOwnProperty('latitude')) return true;
			if (typeof state.data.forecast !== 'object') return true;
			if (!state.data.forecast.daily || !Array.isArray(state.data.forecast.daily)) return true;
			if (!state.data.forecast.currently || !state.data.forecast.currently.temperature) return true;
		},


		// UNIQUE GETTERS
		// TODO: is not necessary, can be accessed by state
		forecast(state) {
			return state.data.forecast;
		},
		
		// TODO: these two access the "settings", should do something about this as well
		// TODO: happens in "Quote" as well (category)
		useCustomLocation({}, {}, {}, rootGetters) {
			return rootGetters.useCustomLocation;
		},

		customLocationQuery({ }, { }, { }, rootGetters) {
			return rootGetters.customLocationQuery;
		},

		customCoordinatesAvailable(state) {
			return !!state.data.customCoordinates.latitude && !!state.data.customCoordinates.longitude;
		},

		coordinatesAvailable(state) {
			return !!state.data.coordinates.latitude && !!state.data.coordinates.longitude;
		},

		coordinates(state, getters) {
			if (getters.useCustomLocation) {
				return state.data.customCoordinates;
			} else if (!getters.useCustomLocation) {
				return state.data.coordinates;
			}
		},

		addressCity(state) {
			return state.data.address.city;
		}
	},

	mutations: {
		// TODO: should refactor how the data is given by the action
		setData(state, { expires, data }) {
			state.expires = expires;
			state.data = { ...state.data, ...data };
		},
		setFinishedLoading(state, bool) {
			state.finishedLoading = !!bool;
		},
		setDataStatus(state, status) {
			state.dataStatus = status;
		},

		// UNIQUE MUTATIONS
		setCoordinates(state, { latitude, longitude }) {
			state.data.coordinates = { latitude, longitude };
		},
		setCustomCoordinates(state, {latitude, longitude}) {
			state.data.customCoordinates = { latitude, longitude };
		},
		resetCustomCoordinates(state) {
			state.data.customCoordinates = { latitude: null, longitude: null };
		},
		setExpires(state, time) {
			state.expires = time;
		}
	},

	actions: {
		// TODO: unique "settingsChanged" function
		async settingsChanged({ commit, dispatch }) {
			commit('setExpires', new Date().getTime());
			commit('setDataStatus', 'stale');
			await dispatch('fetchApiData');
			commit('setFinishedLoading', true);
		},
		async storageLoadFail({ commit, dispatch }) {
			await dispatch('fetchApiData');
			commit('setFinishedLoading', true);
		},
		async storageLoadSuccess({ getters, commit, dispatch }, {data, expires}) {
			dispatch('setLocalData', {data, expires});
			if (getters.hasExpired || getters.dataInvalid) {
				commit('setDataStatus', 'stale');
				await dispatch('fetchApiData');
			} else {
				commit('setDataStatus', "fresh");
			}

			commit('setFinishedLoading', true);
		},
		setLocalData({commit}, { data, expires }) {
			commit('setData', {	expires, data });

			// TODO: this is specific to this module
			if (data.customCoordinates && data.customCoordinates.latitude) {
				commit('setCustomCoordinates', data.customCoordinates);
			}			
		},
		setApiData({ commit }, apiData) {
			let {
				expires,
				forecast,
				address
			} = apiData;

			const city = address.bestAddress.split(',')[0];

			commit('setData', {
				expires,
				data: {
					forecast,
					address: {
						city,
						street: null
					}
				}
			})

			commit('setDataStatus', 'fresh');
		},
		async fetchApiData({dispatch, rootGetters}) {
			try {
				let coordinates = await dispatch('getSetCorrectLocation');
				const { latitude, longitude } = coordinates;
				const units = rootGetters.units;
				const lang = rootGetters.language;
				let apiData = await weatherRequest({ latitude, longitude, units, lang });
				dispatch('setApiData', {
					expires: apiData.expires,
					forecast: apiData.data.forecast,
					address: apiData.data.address
				});
			} catch (e) {
				console.warn("Could not load WEATHER api data...");
				console.warn(e);
			}
		},
		
		// UNIQUE ACTIONS
		async getSetCorrectLocation({ state, getters, commit, dispatch }) {
			const useCustom = getters.useCustomLocation;
			const customCoordsAvailable = getters.customCoordinatesAvailable;
			const locationQueryAvailable = !!getters.customLocationQuery;

			let coords = {
				latitude: null,
				longitude: null
			}

			try {
				if (useCustom && customCoordsAvailable) {
					//return customCoords
					coords = { ...state.data.customCoordinates };
				} else if (useCustom && locationQueryAvailable) {
					//get location from locationRequest API
					let customLocation = await dispatch('fetchCustomLocation');
					coords = { ...customLocation };
				} else {
					//get location from browser
					let browserLocation = await getPosition();
					coords = { ...browserLocation };
					commit('resetCustomCoordinates');
					commit('setCoordinates', coords);
				}
				return Promise.resolve(coords);
			}
			catch (e) {
				console.warn("Could not get LOCATION data");
				return Promise.reject(e);
			}
		},

		async fetchCustomLocation({getters, commit}) {
			try {
				let locationQuery = getters.customLocationQuery;
				let data = await locationRequest({ address: locationQuery });
				const { coordinates } = data.data;
				commit('setCustomCoordinates', coordinates);
				return Promise.resolve(coordinates);
			} catch (e) {
				console.warn("Getting custom location failed");
				return Promise.reject(e);
			}
		}
	}
}

export default weatherStore;