import widgetsApi from '../api';
const weatherApi = widgetsApi.weather;
const locationApi = widgetsApi.location;

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
		dataLoaded: false
	},

	getters: {
		weatherWatch(state) {
			const { expires, forecast, address, coordinates, dataLoaded } = state;
			return { expires, forecast, address, coordinates, dataLoaded };
		},
		forecast(state) {
			return state.forecast;
		},
		addressCity(state) {
			return state.address.city;
		},
		weatherDataLoaded(state) {
			return state.dataLoaded;
		},
		useCustomLocation({}, {}, {}, rootGetters) {
			return rootGetters.useCustomLocation && !!rootGetters.customLocationToUse;
		},
		customLocationToUse({}, {}, {}, rootGetters) {
			return rootGetters.customLocationToUse;
		}
	},

	mutations: {
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
		weatherStorageLoadFailed({ dispatch }) {
			dispatch('initiateGetWeather');
		},
		weatherStorageLoadExpired({ dispatch }, localData) {
			dispatch('initiateGetWeather', localData);
		},
		weatherSetFromStorage({ commit, dispatch }, localData) {
			if (localData.expires == null || !localData.dataLoaded) {
				dispatch('weatherStorageLoadFailed');
				return;
			}
			const {
				expires,
				forecast,
				address,
				coordinates
			} = localData;

			commit('setWeatherDataExpires', expires);
			commit('setForecast', forecast);
			commit('setAddress', address);
			commit('setCoordinates', coordinates);
			commit('setWeatherDataLoaded', true);
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
				let url = weatherApi.url.get(latitude, longitude);
				let data = await weatherApi.request(url);
				return data;
			} catch (e) {
				console.error(e);
				return Promise.reject("Could not get weather from server");
			}
		},

		async getCustomLocationFromServer({commit}, inputLocation) {
			try {
				let url = locationApi.url.get();
				let data = await locationApi.request(url, { address: inputLocation });
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

function getPosition() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(({ coords }) => {
			console.log(coords);
			const { latitude, longitude } = coords;
			resolve({ latitude, longitude });
		}, (err) => {
			console.warn("Error in retrieving location. ", err);
			reject(err);
		}, { timeout: 20000, enableHighAccuracy: true });
	})
}