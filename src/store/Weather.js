import widgetsApi from './api/index';
const weatherApi = widgetsApi.weather;
const locationApi = widgetsApi.location;

const weatherStore = {

	state: {
		// weatherData: {
		// 	address: {
		// 		city: null,
		// 		bestAddress: null
		// 	},
		// 	forecast: {}
		// },

		// expires: null,

		// locationData: {
		// 	useCustomLocation: null,
		// 	coordinates: {
		// 		latitude: null,
		// 		longitude: null
		// 	},
		// 	address: {
		// 		city: null,
		// 		street: null
		// 	}
		// },

		// weatherDataLoaded: false

		weatherData: {
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
			useCustomLocation: null,
			weatherDataLoaded: false
		}
	},

	getters: {
		weatherWatch(state) {
			return state.weatherData;
		},
		forecast(state) {
			return state.weatherData.forecast;
		},
		addressCity(state) {
			return state.weatherData.address.city;
		},
		weatherDataLoaded(state) {
			return state.weatherData.weatherDataLoaded;
		},
		useCustomLocation(state) {
			return state.weatherData.useCustomLocation;
		}
		/* weatherWatch: state => {
			return { weatherData, expires, locationData } = state;
		},
		forecast: state => state.weatherData.forecast,
		addressCity(state) {
			if (getters.useCustomLocation === true) {
				return state.locationData.address.city;
			} else {
				return state.weatherData.address.city;
			}
			// if (state.apiData && state.apiData.locationCustom && state.apiData.locationCustom.active) {
			// 	return state.apiData.locationCustom.address.city;
			// } else {
			// 	let address = state.apiData.address.bestAddress;
			// 	if (typeof address === 'string') return address.split(',')[0];
			// }
		},
		weatherDataLoaded: state => state.weatherDataLoaded,
		useCustomLocation: state => state.locationData.useCustomLocation */
	},

	mutations: {
		setWeatherDataExpires(state, expires) {
			state.weatherData.expires = expires;
		},
		setForecast(state, forecast) {
			state.weatherData.forecast = { ...forecast };
		},
		setAddress(state, {city, street = null}) {
			state.weatherData.address = { city, street };
		},
		setCoordinates(state, coords) {
			state.weatherData.coordinates = { ...coords };
		},
		setUseCustomLocation(state, bool) {
			if (bool == null) {
				state.weatherData.useCustomLocation = !state.weatherData.useCustomLocation;
			} else {
				state.weatherData.useCustomLocation = bool;
			}
		},
		setWeatherDataLoaded(state, bool) {
			if (bool == null) {
				state.weatherData.weatherDataLoaded = !state.weatherData.weatherDataLoaded;
			} else {
				state.weatherData.weatherDataLoaded = bool;
			}
		}
	},

	actions: {
		weatherStorageLoadFailed({ commit, dispatch }) {
			commit('setUseCustomLocation', false);
			dispatch('initiateGetWeather');
		},
		weatherStorageLoadExpired({ commit, dispatch }, localData) {
			const { useCustomLocation = false } = localData;
			commit('setUseCustomLocation', useCustomLocation);
			dispatch('initiateGetWeather', localData);
		},
		weatherSetFromStorage({ commit, dispatch }, localData) {
			if (localData.expires == null || !localData.weatherDataLoaded) {
				dispatch('weatherStorageLoadFailed');
				return;
			}
			const {
				expires,
				forecast,
				address,
				coordinates,
				useCustomLocation = false
			} = localData;

			commit('setWeatherDataExpires', expires);
			commit('setForecast', forecast);
			commit('setAddress', address);
			commit('setCoordinates', coordinates);
			commit('setUseCustomLocation', useCustomLocation);
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

		weatherSetFromServer({state, commit}, weatherData) {
			const { expires } = weatherData;
			const { forecast, address } = weatherData.data;

			commit('setWeatherDataExpires', expires);
			commit('setForecast', forecast);

			if (state.weatherData.useCustomLocation === false) {
				const city = address.bestAddress.split(',')[0];
				commit('setAddress', { city, street: null });
			}
			commit('setWeatherDataLoaded', true);
		},

		async getCoordinates({ state, commit }) {
			if (state.weatherData.useCustomLocation === true) {
				return state.weatherData.coordinates;
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