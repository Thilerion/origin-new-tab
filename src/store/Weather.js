import axios from 'axios';

const WEATHER_EXP = 3 * 60 * 60 * 1000; //3 uur

const weatherStore = {

	state: {
		locationLocal: {
			latitude: null,
			longitude: null
		},

		apiData: {
			lastRetrieved: null,
			location: {},
			forecast: {}
		}

	},

	getters: {
		weatherWatch: state => {
			return {
				locationLocal: state.locationLocal,
				apiData: state.apiData
			}
		},
		weatherDataFresh: state => (new Date().getTime() - state.apiData.lastRetrieved) < WEATHER_EXP,
		forecast: state => state.apiData.forecast,
		location: state => state.apiData.location,
		address: state => state.apiData.location.bestAddress,
		addressCity(state) {
			let address = state.apiData.location.bestAddress;
			return address.split(',')[0];
		},
		fresh: state => new Date().getTime() - state.apiData.lastRetrieved < WEATHER_EXP
	},

	mutations: {
		setLocalLocation: (state, { latitude, longitude }) => {
			state.locationLocal.latitude = latitude;
			state.locationLocal.longitude = longitude;
		},
		setApiData(state, { location, forecast, lastRetrieved = new Date().getTime() }) {
			state.apiData.lastRetrieved = lastRetrieved;
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
		weatherSet({ dispatch, commit }, weatherData) {
			let fresh = new Date().getTime() - weatherData.apiData.lastRetrieved < WEATHER_EXP;
			console.warn('Setting weather from storage. Freshness is: ', fresh);
			if (fresh) {
				console.warn('It is fresh, so committing to store.');
				commit('setLocalLocation', weatherData.locationLocal);
				commit('setApiData', weatherData.apiData);
			} else {
				console.warn('It is not fresh, so dispatching the weatherLoadFailed');
				dispatch('weatherLoadFailed');
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
		}, { timeout: 5000, maximumAge: WEATHER_EXP });
	})
}

async function getWeatherData(latitude, longitude) {
	try {
		let res = await axios.get(`http://localhost:3000/forecast/${latitude}/${longitude}`);
		return res.data;
	}
	catch (e) {
		console.warn(e);
	}
}