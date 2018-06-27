import { weatherRequest, locationRequest } from '../api/';
import getPosition from '../libs/geolocation';

const weatherStore = {
	namespaced: true,

	state: {
		expires: null,
		forecast: {},
		address: {
			city: null,
			street: null
		},
		coordinates: {
			latitude: null,
			longitude: null
		},
		customCoordinates: {
			latitude: null,
			longitude: null
		},

		finishedLoading: false,
		dataStatus: null
	},

	getters: {
		// COMMMON GETTERS
		toWatch(state) {
			const { expires, forecast, address, customAddress, coordinates, customCoordinates } = state;
			return { expires, forecast, address, customAddress, coordinates, customCoordinates };
		},
		hasExpired(state) {
			return state.expires - new Date().getTime() < 0;
		},

		dataLoadSuccessful(state) {
			return state.dataStatus != null && state.finishedLoading;
		},

		dataLoadFailed(state) {
			return state.dataStatus === null && state.finishedLoading;
		},

		dataInvalid(state) {
			if (state.finishedLoading) return false;

			if (!state.expires) return true;
			if (typeof state.address !== 'object') return true;
			if (!state.address.city) return true;
			if (typeof state.coordinates !== 'object') return true;
			if (!state.coordinates.hasOwnProperty('latitude')) return true;
			if (typeof state.customCoordinates !== 'object') return true;
			if (!state.customCoordinates.hasOwnProperty('latitude')) return true;
			if (typeof state.forecast !== 'object') return true;
			if (!state.forecast.daily || !Array.isArray(state.forecast.daily)) return true;
			if (!state.forecast.currently || !state.forecast.currently.temperature) return true;
		},

		// UNIQUE GETTERS
		forecast(state) {
			return state.forecast;
		},
		
		useCustomLocation({}, {}, {}, rootGetters) {
			return rootGetters.useCustomLocation;
		},

		customLocationQuery({ }, { }, { }, rootGetters) {
			return rootGetters.customLocationQuery;
		},

		customCoordinatesAvailable(state) {
			return !!state.customCoordinates.latitude && !!state.customCoordinates.longitude;
		},

		coordinatesAvailable(state) {
			return !!state.coordinates.latitude && !!state.coordinates.longitude;
		},

		coordinates(state, getters) {
			if (getters.useCustomLocation) {
				return state.customCoordinates;
			} else if (!getters.useCustomLocation) {
				return state.coordinates;
			}
		},

		addressCity(state) {
			return state.address.city;
		}
	},

	mutations: {
		// COMMON MUTATIONS
		setData(state, data) {
			let {
				expires,
				forecast,
				address
			} = data;

			let {
				city,
				street
			} = address;

			state.expires = expires;
			state.forecast = forecast;
			state.address.city = city || "";
			state.address.street = street || "";
		},
		setFinishedLoading(state, bool) {
			state.finishedLoading = !!bool;
		},
		setDataStatus(state, status) {
			state.dataStatus = status;
		},

		// UNIQUE MUTATIONS
		setCoordinates(state, {latitude, longitude}) {
			state.coordinates = { latitude, longitude };
		},
		setCustomCoordinates(state, {latitude, longitude}) {
			state.customCoordinates = { latitude, longitude };
		},
		resetCustomCoordinates(state) {
			state.customCoordinates = { latitude: null, longitude: null };
		},
		setExpires(state, time) {
			state.expires = time;
		}
	},

	actions: {
		// COMMON ACTIONS
		async settingsChanged({ commit, dispatch }, changes = []) {
			commit('setExpires', new Date().getTime());
			commit('setDataStatus', 'stale');
			await dispatch('fetchApiData');
			commit('setFinishedLoading', true);
		},
		async storageLoadFail({commit, dispatch}) {
			await dispatch('fetchApiData');
			commit('setFinishedLoading', true);
		},
		async storageLoadSuccess({getters, commit, dispatch}, localData) {
			dispatch('setLocalData', localData);
			if (getters.hasExpired || getters.dataInvalid) {
				commit('setDataStatus', 'stale');
				await dispatch('fetchApiData');
			} else {
				commit('setDataStatus', "fresh");
			}

			commit('setFinishedLoading', true);
		},
		setLocalData({commit}, localData) {
			let {
				expires,
				forecast,
				address,
				customCoordinates
			} = localData;

			commit('setData', {
				expires,
				forecast,
				address
			});

			if (customCoordinates && customCoordinates.latitude) {
				commit('setCustomCoordinates', customCoordinates);
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
				forecast,
				address: {
					city,
					street: null
				}
			})

			commit('setDataStatus', 'fresh');
		},
		async fetchApiData({dispatch}) {
			try {
				let coordinates = await dispatch('getSetCorrectLocation');
				const {latitude, longitude} = coordinates;
				let apiData = await weatherRequest({ latitude, longitude });
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
					coords = { ...state.customCoordinates };
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