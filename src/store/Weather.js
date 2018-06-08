import widgetsApi from './api/index';
const weatherApi = widgetsApi.weather;

const weatherStore = {

	state: {
		locationLocal: {
			latitude: null,
			longitude: null
		},

		apiData: {
			expires: null,
			location: {},
			forecast: {}
		},
		dataLoaded: false
	},

	getters: {
		weatherWatch: state => state.apiData,
		forecast: state => state.apiData.forecast,
		location: state => state.apiData.location,
		address: state => state.apiData.location.bestAddress,
		addressCity(state) {
			let address = state.apiData.location.bestAddress;
			if (typeof address === 'string') return address.split(',')[0];
		},
		weatherDataLoaded: state => state.dataLoaded
	},

	mutations: {
		setLocalLocation: (state, { latitude, longitude }) => {
			state.locationLocal.latitude = latitude;
			state.locationLocal.longitude = longitude;
		},
		setWeatherData(state, { expires, location, forecast }) {
			state.apiData.expires = expires;
			state.apiData.location = { ...location };
			state.apiData.forecast = { ...forecast };
			state.dataLoaded = true;
		}
	},

	actions: {
		async getLocalLocation({ commit, state }) {
			console.warn('Getting location now');
			commit('setLocalLocation', await getPosition());			
		},
		async getWeatherFromServer({state, dispatch}, commitOnFail) {
			try {
				await dispatch('getLocalLocation');
				const { latitude, longitude } = state.locationLocal;
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
		weatherStorageLoadFailed({ dispatch }) {
			dispatch('getWeatherFromServer');
		},
		weatherStorageLoadExpired({ dispatch }, data) {
			dispatch('getWeatherFromServer', data);
		},
		weatherSetFromStorage({ commit }, localData) {
			const { location, forecast, expires } = localData;
			commit('setWeatherData', { expires, location, forecast });
		},
		weatherSetFromApi({ commit }, apiData) {
			const { expires } = apiData;
			const location = apiData.data.location;
			const forecast = apiData.data.forecast;
			commit('setWeatherData', { expires, location, forecast });
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
		}, { timeout: 20000 });
	})
}