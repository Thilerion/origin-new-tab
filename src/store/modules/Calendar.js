import widgetsApi from '../api';
const calendarApi = widgetsApi.calendar;
import { createCalendarList, reduceCalendarList } from '../libs/calendarModel';

import {
	getAuthTokenInteractive,
	getAuthTokenSilent,
	removeCachedAuthToken,
	revokeOauthAccess
} from '../libs/identity';

const CALENDAR_FORMAT = "dddd D MMMM";
const TIME_FORMAT = "HH:mm";

const calendarStore = {
	state: {

		calendarFormat: CALENDAR_FORMAT,
		timeFormat: TIME_FORMAT,

		token: null,
		dataLoaded: null,

		calendarData: {
			permission: false
		},

		events: {}
		
	},

	getters: {

		calenderEventsMaxAmount(state) {
			const MAX_AMOUNT = 3;
			let reduced = {};
			let currentAmount = 0;
			let firstDayAdded = false;
			const events = state.events;

			for (let i = 0; i < 14 && currentAmount < MAX_AMOUNT; i++) {
				if (events[i]) {
					if (!firstDayAdded) {
						reduced[i] = events[i];
						currentAmount += events[i].length;
					} else {
						events[i].forEach(e => {
							if (currentAmount < MAX_AMOUNT) {
								currentAmount += 1;
								if (reduced[i]) reduced[i].push(e);
								else reduced[i] = [e];
							}						
						})
					}					
				}
			}
			return reduced;
		},

		calendarWatch(state) {
			return state.calendarData;
		},

		calendarDateFormat(state) {
			return state.calendarFormat;
		},

		calendarTimeFormat(state) {
			return state.timeFormat;
		}

	},

	mutations: {

		setCalendarToken(state, token) {
			state.token = token;
		},

		setCalendarEvents(state, events) {
			state.events = { ...events };
		},

		setCalendarPermission(state, bool) {
			state.calendarData.permission = bool;
		},

		setCalendarDataLoaded(state, bool) {
			state.dataLoaded = bool;
		}

	},

	actions: {
		parseAndSetCalendarData({ commit }, data) {
			const calendarList = createCalendarList(data.items);
			const reducedList = reduceCalendarList(calendarList);
			commit('setCalendarEvents', reducedList);
			commit('setCalendarDataLoaded', true);
		},

		async getCalendarFromServer({ state, commit, dispatch }) {
			try {
				const url = calendarApi.url.get();
				const token = state.calendarToken;
				let data = await calendarApi.request(url, token);
				//TODO: do something with data
				dispatch('parseAndSetCalendarData', data);				
			}
			catch (e) {
				console.warn("Error in getting data from server", e);
				commit('setCalendarDataLoaded', false);
			}
		},

		calendarStorageLoadFailed({dispatch}) {
			dispatch('initiateCalendarModule');
		},

		calendarSetFromStorage({ commit, dispatch }, calData) {
			commit('setCalendarPermission', calData.permission);
			dispatch('initiateCalendarModule');		
		},

		async initiateCalendarModule({state, dispatch}) {
			if (!state.calendarWidgetActive) return;

			//GET TOKEN SILENT
			//if succes, SET TOKEN, and FETCH DATA
			//if error, SET PERMISSION FALSE
			await dispatch('getGoogleAuthTokenSilent');
			if (state.calendarToken) {
				dispatch('getCalendarFromServer');
			} else {
				console.warn("Could not get token");
			}
		},

		getGoogleAuthTokenSilent({commit}) {
			return getAuthTokenSilent()
				.then(token => {
					commit('setCalendarToken', token);
					commit('setCalendarPermission', true);
					return token;
				}).catch(err => {
					commit('setCalendarPermission', false);
					commit('setCalendarToken', null);
					console.warn(err.message);
				})
		},
		getGoogleAuthTokenInteractive({commit, dispatch}) {
			return getAuthTokenInteractive()
				.then(token => {
					commit("setCalendarToken", token);
					commit('setCalendarPermission', true);
					dispatch('initiateCalendarModule');
					return token;
				}).catch(err => {
					commit('setCalendarPermission', false);
					commit('setCalendarToken', null);
					console.warn(err.message);
				});
		},
		async removeAndRevokeAuthToken({ state, dispatch }) {
			const token = state.calendarToken;
			await dispatch('removeCachedAuthToken', token);
			await dispatch('revokeAccessToken', token);
		},

		retryLoading({dispatch}) {
			dispatch('removeCachedAuthToken')
				.then(() => dispatch('initiateCalendarModule'));
		},

		revokeAccessToken({ state, commit }, token = state.calendarToken) {
			commit('setCalendarPermission', false);
			commit('setCalendarDataLoaded', null);
			return revokeOauthAccess(token)
				.then(() => {
					console.warn("REVOKED ACCESS!");
					commit('setCalendarToken', null);
					return true;
				})
				.catch(err => {
					console.warn(`ERROR IN REVOKING ACCESS: `, err);
				});
		},

		removeCachedAuthToken({ state, commit }, token = state.calendarToken) {
			commit('setCalendarPermission', false);
			return removeCachedAuthToken(token)
				.then(() => {
					console.warn("CACHED TOKEN REMOVED!");
					commit('setCalendarToken', null);
					return true;
				})
				.catch(err => {
					console.warn("ERROR IN REMOVING CACHED TOKEN: ", err);
				})
		}
	}
};

export default calendarStore;