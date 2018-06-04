import axios from 'axios';
import API_URL from './api/config.api';

const WEATHER_EXP = 3 * 60 * 60 * 1000; //3 uur

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
		}

	},

	getters: {
		weatherWatch: state => state.apiData,
		forecast: state => state.apiData.forecast,
		location: state => state.apiData.location,
		address: state => state.apiData.location.bestAddress,
		addressCity(state) {
			let address = state.apiData.location.bestAddress;
			if (typeof address === 'String') return address.split(',')[0];
		},
		expires: state => state.apiData.expires
	},

	mutations: {
		setLocalLocation: (state, { latitude, longitude }) => {
			state.locationLocal.latitude = latitude;
			state.locationLocal.longitude = longitude;
		},
		setApiData(state, { location, forecast, expires }) {
			state.apiData.expires = expires;
			state.apiData.location = { ...location };
			state.apiData.forecast = { ...forecast };
		}
	},

	actions: {
		async getLocalLocation({ commit, state }) {
			console.warn('Getting location now');
			commit('setLocalLocation', await getPosition());			
		},
		async weatherLoadFailed({ state, dispatch, commit }) {
			console.warn('Weather load has failed, now getting location and setting api data');
			await dispatch('getLocalLocation');
			const { latitude, longitude } = state.locationLocal;
			console.warn('Now setting api data after failing');
			commit('setApiData', await getWeatherData(latitude, longitude));
		},
		weatherStorageLoadFailed({ dispatch }) {
			dispatch('weatherLoadFailed');
		},
		weatherStorageLoadExpired({ dispatch }, data) {
			//should commit data if getting from server fails
			dispatch('weatherLoadFailed');
		},
		weatherSet({ commit }, data) {
			commit('setApiData', data);
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
		}, { timeout: 5000, maximumAge: WEATHER_EXP });
	})
}

async function getWeatherData(latitude, longitude) {
	try {
		let res = await axios.get(`${API_URL}/forecast/${latitude}/${longitude}`);
		return res.data.data;
	}
	catch (e) {
		console.warn(e);
	}
}