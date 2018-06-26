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
		customAddress: {
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

		// UNIQUE GETTERS
		forecast(state) {
			return state.forecast;
		},
		useCustomLocation({}, {}, {}, rootGetters) {
			return rootGetters.useCustomLocation && !!rootGetters.customLocationToUse;
		},

		coordinates(state, getters) {
			if (getters.useCustomLocation) {
				return state.customCoordinates;
			} else if (!getters.useCustomLocation) {
				return state.coordinates;
			}
		},
		addressCity(state, getters) {
			if (getters.useCustomLocation) {
				return state.customAddress.city;
			} else if (!getters.useCustomLocation) {
				return state.address.city;
			}
		}
	},

	mutations: {
		// COMMON MUTATIONS
		setData(state, data) {

		},
		setFinishedLoading(state, bool) {

		},
		setDataStatus(state, status) {

		},

		// UNIQUE MUTATIONS
		setCustomAddressQuery() {

		},
		setAddress() {

		},
		setCustomAddress() {

		},
		setCoordinates() {

		},
		setCustomCoordinates() {

		},


		// OLD BELOW
		setWeatherDataExpires(state, expires) {
			state.expires = expires;
		},
		setForecast(state, forecast) {
			state.forecast = { ...forecast };
		},
		setAddress(state, {city, street = null}) {
			state.address = { city, street };
		},
		setCoordinates(state, coords) {
			state.coordinates = { ...coords };
		},
		setWeatherDataLoaded(state, bool) {
			if (bool == null) {
				state.dataLoaded = !state.dataLoaded;
			} else {
				state.dataLoaded = bool;
			}
		}
	},

	actions: {
		// COMMON ACTIONS
		settingsChanged({}, changes = []) {

		},
		async storageLoadFail() {

		},
		async storageLoadSuccess() {

		},
		setLocalData() {

		},
		setApiData() {

		},
		fetchApiData() {

		},
		
		// UNIQUE ACTIONS

		// OLD BELOW

		storageLoadFailOLD({ dispatch }) {
			dispatch('initiateGetWeather');
		},
		storageLoadExpired({ getters, commit, dispatch }, localData) {
			if (getters.useCustomLocation) {
				commit('setAddress', localData.address);
				commit('setCoordinates', localData.coordinates);
			}
			dispatch('initiateGetWeather', localData);
		},
		storageLoadSuccess({ commit, dispatch }, localData) {
			const {
				expires,
				forecast,
				address,
				coordinates
			} = localData;

			if (localData.expires == null || !localData.dataLoaded) {
				dispatch('storageLoadFail');
				return;
			}
			if (expires - new Date().getTime() < 0) return dispatch('storageLoadExpired', localData);

			commit('setWeatherDataExpires', expires);
			commit('setForecast', forecast);
			commit('setAddress', address);
			commit('setCoordinates', coordinates);
			commit('setWeatherDataLoaded', true);
		},

		setLocalDataToStore({ }, localData) {
			const { expires, forecast, address, coordinates } = localData;
			commit('setWeatherDataExpires', expires);
			commit('setForecast', forecast);
			commit('setAddress', address);
			commit('setCoordinates', coordinates);



		},
		setExternalDataToStore({ }, externalData) {
			
		},

		async initiateGetWeather({ commit, dispatch }, fallbackData) {
			try {
				let coords = await dispatch('getCoordinates');
				console.log(coords);
				let weatherData = await dispatch('getWeatherFromServer', coords);
				dispatch('weatherSetFromServer', weatherData);

			} catch (e) {
				console.warn(e);
				if (fallbackData) {
					console.log('Setting fallback weather data');
					dispatch('weatherSetFromStorage', fallbackData);
				} else {
					commit('setWeatherDataLoaded', false);
					console.warn("Setting/retrieving weather was not succesfull");
				}
			}
		},

		weatherSetFromServer({getters, commit}, weatherData) {
			const { expires } = weatherData;
			const { forecast, address } = weatherData.data;

			commit('setWeatherDataExpires', expires);
			commit('setForecast', forecast);
			if (getters.useCustomLocation === false) {
				const city = address.bestAddress.split(',')[0];
				commit('setAddress', { city, street: null });
			}
			commit('setWeatherDataLoaded', true);
		},

		async getCoordinates({ state, getters, commit }) {
			if (getters.useCustomLocation === true && state.coordinates.latitude && state.coordinates.longitude) {
				return state.coordinates;
			} else {
				try {
					let coords = await getPosition();
					commit('setCoordinates', coords);
					return coords;
				} catch (e) {
					console.warn("Error in getting location (TODO, ERROR HANDLER ACTION):");
					console.error(e);
					return Promise.reject('Could not get coordinates');
				}				
			}
		},
		async getWeatherFromServer({}, {latitude, longitude}) {
			try {
				let data = await weatherRequest({ latitude, longitude });
				return data;
			} catch (e) {
				console.warn(e);
				return Promise.reject("Could not get weather from server");
			}
		},

		async getCustomLocationFromServer({commit}, inputLocation) {
			try {
				let data = await locationRequest({ address: inputLocation });
				const { coordinates, address } = data.data;
				commit('setCoordinates', coordinates);
				commit('setAddress', address);
				return address.city;
			} catch (e) {
				console.warn("Getting custom location failed");
				return Promise.reject(e);
			}
		},

		async weatherSettingsChanged({ state, getters, dispatch }, { enable, disable, newLocation }) {
			const currentWeatherData = state.dataLoaded ? getters.weatherWatch : null;
			if (disable) {
				dispatch('initiateGetWeather', currentWeatherData);
			} else if (newLocation) {
				try {
					await dispatch('getCustomLocationFromServer', newLocation);
					dispatch('initiateGetWeather', currentWeatherData);
				} catch (e) {
					console.warn("Error in setting custom location from settings!");
					return Promise.reject(e);
				}
			}
		}
	}
}

export default weatherStore;