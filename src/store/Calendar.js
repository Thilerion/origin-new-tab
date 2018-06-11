import widgetsApi from './api/index';
const calendarApi = widgetsApi.calendar;

import isToday from "date-fns/is_today";
import differenceInDays from "date-fns/difference_in_calendar_days";
import format from "date-fns/format";
import isBefore from "date-fns/is_before";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import compareAsc from "date-fns/compare_asc";
import parse from 'date-fns/parse';

import { createCalendarList, reduceCalendarList } from './utils/calendarModel';

import {
	getAuthTokenInteractive,
	getAuthTokenSilent,
	removeCachedAuthToken,
	revokeOauthAccess
} from './utils/identity';

const CALENDAR_FORMAT = "dddd D MMMM";
const TIME_FORMAT = "HH:mm";

const calendarStore = {
	state: {

		calendarFormat: CALENDAR_FORMAT,
		timeFormat: TIME_FORMAT,

		token: null,
		dataLoaded: null,

		calendarWatch: {
			permission: false
		},

		events: {}
		
	},

	getters: {
		calendarToken(state) {
			return state.token;
		},

		calendarEvents(state) {
			return state.events;
		},

		calendarWatch(state) {
			return state.calendarWatch;
		},

		calendarPermission(state) {
			return state.calendarWatch.permission;
		},

		calendarDataLoaded(state) {
			return state.dataLoaded;
		},

		calendarWidgetActive(state, getters) {
			return !!(getters.widgets.find(w => w.name === 'calendar').active);
		},

		calendarFormat(state) {
			return state.calendarFormat;
		},
		
		OLDeventsUpcomingWeek(state) {
			return state.events.reduce((acc, event) => {
				//endTime later than now
				//difference in days of startTime max 6 (today is 0)
				const start = new Date(event.start);
				const end = new Date(event.end);
				const today = new Date();

				if (differenceInDays(end, today) < 0) {
					//ended before today
					return acc;
				} else if (isBefore(end, today)) {
					//ended today, but has already ended
					return acc;
				} else if (differenceInDays(start, today) > 6) {
					//starts at least a week later
					return acc;
				}

				let newEvent = { ...event };

				newEvent.startsToday = isToday(start);
				newEvent.endsToday =
					isToday(end) || (isToday(start) && newEvent.allDay);
				newEvent.daysFromToday = differenceInDays(start, today);
				newEvent.formattedDay = format(start, state.calendarFormat);
				newEvent.formattedTimeStart = format(start, state.timeFormat);
				newEvent.formattedTimeEnd = format(end, state.timeFormat);

				console.log(newEvent);

				acc.push(newEvent);
				return acc;
			}, []);
		},
		OLDeventsByDay(state, getters) {
			let events = JSON.parse(JSON.stringify(getters.eventsUpcomingWeek));
			let byDay = {};
			events.forEach(event => {
				const day = event.formattedDay;
				if (byDay[day]) {
					byDay[day].push(event);
				} else {
					byDay[day] = [event];
				}
			});
			for (const day in byDay) {
				byDay[day].sort((a, b) => {
					// debugger;
					if (a.allDay || b.allDay) {
						return b.allDay - a.allDay;
					}
					const startDiff = compareAsc(a.start, b.start);
					return (startDiff === 0) ? compareAsc(a.end, b.end) : startDiff;
				})
			}
			return byDay;
		},

	},

	mutations: {

		setToken(state, token) {
			console.log("SETTING TOKEN: ", token);
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
			console.log(calendarList, reducedList);
			commit('setCalendarEvents', reducedList);
			commit('setCalendarDataLoaded', true);
		},

		async getCalendarFromServer({ getters, commit, dispatch }) {
			try {
				const url = calendarApi.url.get();
				const token = getters.calendarToken;
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

		calendarSetFromStorage({commit, dispatch}, calData) {
			commit('setCalendarPermission', calData.permission);
			dispatch('initiateCalendarModule');
		},

		async initiateCalendarModule({getters, dispatch}) {
			if (!getters.calendarWidgetActive) return;

			//GET TOKEN SILENT
			//if succes, SET TOKEN, and FETCH DATA
			//if error, SET PERMISSION FALSE
			await dispatch('getGoogleAuthTokenSilent');
			if (getters.calendarToken) {
				console.log("Got token! Getting data from server now.");
				dispatch('getCalendarFromServer');
			} else {
				console.log("Could not get token");
			}
		},

		getGoogleAuthTokenSilent({commit}) {
			return getAuthTokenSilent()
				.then(token => {
					commit('setToken', token);
					commit('setHasPermission', true);
					return token;
				}).catch(err => {
					commit('setHasPermission', false);
					commit('setToken', null);
					console.warn(err);
				})
		},
		getGoogleAuthTokenInteractive({commit, dispatch}) {
			return getAuthTokenInteractive()
				.then(token => {
					commit("setToken", token);
					commit('setHasPermission', true);
					dispatch('getCalendarData');
					return token;
				}).catch(err => {
					commit('setHasPermission', false);
					commit('setToken', null);
					console.warn(err);
				});
		},
		async removeAndRevokeAuthToken({ getters, dispatch }) {
			const token = getters.token;
			await dispatch('removeCachedAuthToken', token);
			await dispatch('revokeAccessToken', token);
		},
		revokeAccessToken({ getters, commit }, token = getters.token) {
			commit('setHasPermission', false);
			return revokeOauthAccess(token)
				.then(() => {
					console.log("REVOKED ACCESS!");
					commit('setToken', null);
					return true;
				})
				.catch(err => {
					console.warn(`ERROR IN REVOKING ACCESS: `, err);
				});
		},
		removeCachedAuthToken({ getters, commit }, token = getters.token) {
			commit('setHasPermission', false);
			return removeCachedAuthToken(token)
				.then(() => {
					console.log("CACHED TOKEN REMOVED!");
					commit('setToken', null);
					return true;
				})
				.catch(err => {
					console.warn("ERROR IN REMOVING CACHED TOKEN: ", err);
				})
		}
	}
};

export default calendarStore;
