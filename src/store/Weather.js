import widgetsApi from './api/index';
const weatherApi = widgetsApi.weather;
const locationApi = widgetsApi.location;

const weatherStore = {

	state: {
		locationLocal: {
			latitude: null,
			longitude: null
		},

		apiData: {
			expires: null,
			address: {},
			forecast: {},
			locationCustom: {
				active: false,
				coordinates: {
					latitude: null,
					longitude: null
				},
				address: {
					city: null,
					street: null
				}
			}
		},

		dataLoaded: false
	},

	getters: {
		weatherWatch: state => state.apiData,
		forecast: state => state.apiData.forecast,
		address: state => state.apiData.address,
		addressCity(state) {
			if (state.apiData && state.apiData.locationCustom && state.apiData.locationCustom.active) {
				return state.apiData.locationCustom.address.city;
			} else {
				let address = state.apiData.address.bestAddress;
				if (typeof address === 'string') return address.split(',')[0];
			}
		},
		weatherDataLoaded: state => state.dataLoaded,
		customLocationActive: state => state.apiData.locationCustom.active
	},

	mutations: {
		setLocalLocation: (state, { latitude, longitude }) => {
			state.locationLocal.latitude = latitude;
			state.locationLocal.longitude = longitude;
		},
		setWeatherData(state, { expires, address, forecast }) {
			state.apiData.expires = expires;
			state.apiData.address = { ...address };
			state.apiData.forecast = { ...forecast };
			state.dataLoaded = true;
		},
		setCustomLocation(state, { coordinates, address }) {
			const locCustom = {
				active: true,
				coordinates,
				address
			};
			state.apiData.locationCustom = { ...state.apiData.locationCustom, ...locCustom };
		},
		unsetCustomLocation(state) {
			state.apiData.locationCustom.active = false;
		}
	},

	actions: {
		async getLocalLocation({ commit, state }) {
			console.warn('Getting location now');
			commit('setLocalLocation', await getPosition());			
		},
		async getWeatherFromServer({getters, state, dispatch}, commitOnFail) {
			try {
				if (getters.customLocationActive) {
					var { latitude, longitude } = state.apiData.locationCustom.coordinates;
				} else {
					await dispatch('getLocalLocation');
					var { latitude, longitude } = state.locationLocal;
				}
				
				let url = weatherApi.url.get(latitude, longitude);				
				let data = await weatherApi.request(url);				
				dispatch('weatherSetFromApi', data);
			}
			catch (e) {
				if (commitOnFail) {
					console.warn("Error in getting weather from server. However, old date will be committed now. ", e);
					dispatch('weatherSetFromStorage', commitOnFail);
				} else {
					//TODO: set load failure?
					console.warn("Error in getting weather from server.", e);
				}
			}
		},
		async getLocationFromServer({commit, dispatch}, address) {
			try {
				let url = locationApi.url.get();
				let query = { address };
				let data = await locationApi.request(url, query);
				dispatch('locationCustomSetFromApi', data);
				dispatch('getWeatherFromServer');
			}
			catch (e) {
				console.warn("Failed getting custom location from server...");
				commit('unsetCustomLocation');
			}
		},
		weatherStorageLoadFailed({ dispatch }) {
			dispatch('getWeatherFromServer');
		},
		weatherStorageLoadExpired({ dispatch }, data) {
			dispatch('getWeatherFromServer', data);
		},
		weatherSetFromStorage({ commit }, localData) {
			let { address, forecast, expires, locationCustom = null } = localData;
			if (localData.location && !localData.address) {
				//for clients with older localStorage code
				address = localData.location;
			}
			commit('setWeatherData', { expires, address, forecast });
			if (locationCustom && locationCustom.active) {
				commit('setCustomLocation', locationCustom);
			}
		},
		weatherSetFromApi({ commit }, apiData) {
			const { expires } = apiData;
			const address = apiData.data.address ? apiData.data.address : apiData.data.location;
			const forecast = apiData.data.forecast;
			commit('setWeatherData', { expires, address, forecast });
		},
		locationCustomSetFromApi({ commit }, apiData) {
			commit('setCustomLocation', apiData.data);
		},
		useCustomLocationFromSettings({ dispatch, commit }, customLocation) {
			if (customLocation) {
				dispatch('getLocationFromServer', customLocation);
			} else {
				commit('unsetCustomLocation');
				dispatch('getWeatherFromServer');
			}
		}
	}

}

export default weatherStore;

function getPosition() {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(({ coords }) => {
			const { latitude, longitude } = coords;
			resolve({ latitude, longitude });
		}, (err) => {
			console.warn("Error in retrieving location. ", err);
			reject(err);
		}, { timeout: 20000, enableHighAccuracy: true });
	})
}