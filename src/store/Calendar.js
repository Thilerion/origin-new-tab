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

		calendarData: {
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
			return state.calendarData;
		},

		calendarPermission(state) {
			return state.calendarData.permission;
		},

		calendarDataLoaded(state) {
			return state.dataLoaded;
		},

		calendarWidgetActive(state, getters) {
			return !!(getters.widgets.find(w => w.name === 'calendar').active);
		},

		calendarFormat(state) {
			return state.calendarFormat;
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

		calendarSetFromStorage({ commit, dispatch }, calData) {
			if (process.env.NODE_ENV === 'development') {
				commit('setCalendarPermission', true);
				commit("setCalendarToken", true);
				dispatch('parseAndSetCalendarData', testCalendarData);
			} else {
				commit('setCalendarPermission', calData.permission);
				dispatch('initiateCalendarModule');
			}			
		},

		async initiateCalendarModule({getters, dispatch}) {
			if (!getters.calendarWidgetActive) return;

			//GET TOKEN SILENT
			//if succes, SET TOKEN, and FETCH DATA
			//if error, SET PERMISSION FALSE
			await dispatch('getGoogleAuthTokenSilent');
			if (getters.calendarToken) {
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
		async removeAndRevokeAuthToken({ getters, dispatch }) {
			const token = getters.calendarToken;
			await dispatch('removeCachedAuthToken', token);
			await dispatch('revokeAccessToken', token);
		},

		retryLoading({dispatch}) {
			dispatch('removeCachedAuthToken')
				.then(() => dispatch('initiateCalendarModule'));
		},

		revokeAccessToken({ getters, commit }, token = getters.calendarToken) {
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

		removeCachedAuthToken({ getters, commit }, token = getters.calendarToken) {
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

const testCalendarData = {
	"kind": "calendar#events",
	"etag": "\"p32k8ncnfvb3dm0g\"",
	"summary": "michaelvanm@gmail.com",
	"updated": "2018-06-09T16:05:03.769Z",
	"timeZone": "Europe/Amsterdam",
	"accessRole": "owner",
	"defaultReminders": [],
	"items": [
		{
			"kind": "calendar#event",
			"etag": "\"3057120607538000\"",
			"id": "chgj0pb561gmcb9n70sj0b9k71hm8bb26kpjgb9m74p38db1chhj4dpg6g",
			"status": "confirmed",
			"htmlLink": "https://www.google.com/calendar/event?eid=Y2hnajBwYjU2MWdtY2I5bjcwc2owYjlrNzFobThiYjI2a3BqZ2I5bTc0cDM4ZGIxY2hoajRkcGc2ZyBtaWNoYWVsdmFubUBt",
			"created": "2018-06-05T22:07:13.000Z",
			"updated": "2018-06-09T16:05:03.769Z",
			"summary": "19 juni deadline opgeven ESCAN Satellite on Cognitive Enhancement",
			"creator": {
				"email": "michaelvanm@gmail.com",
				"displayName": "Michael van Meerwijk",
				"self": true
			},
			"organizer": {
				"email": "michaelvanm@gmail.com",
				"displayName": "Michael van Meerwijk",
				"self": true
			},
			"start": {
				"date": "2018-06-11"
			},
			"end": {
				"date": "2018-06-12"
			},
			"iCalUID": "chgj0pb561gmcb9n70sj0b9k71hm8bb26kpjgb9m74p38db1chhj4dpg6g@google.com",
			"sequence": 1,
			"reminders": {
				"useDefault": false
			}
		},
		{
			"kind": "calendar#event",
			"etag": "\"3050358612392000\"",
			"id": "6go3gor461im2b9o6gq3cb9k74r3abb268sjeb9j6csm6ohh71gjadho6s",
			"status": "confirmed",
			"htmlLink": "https://www.google.com/calendar/event?eid=NmdvM2dvcjQ2MWltMmI5bzZncTNjYjlrNzRyM2FiYjI2OHNqZWI5ajZjc202b2hoNzFnamFkaG82cyBtaWNoYWVsdmFubUBt",
			"created": "2018-05-01T12:55:06.000Z",
			"updated": "2018-05-01T12:55:06.196Z",
			"summary": "Kapper",
			"creator": {
				"email": "michaelvanm@gmail.com",
				"displayName": "Michael van Meerwijk",
				"self": true
			},
			"organizer": {
				"email": "michaelvanm@gmail.com",
				"displayName": "Michael van Meerwijk",
				"self": true
			},
			"start": {
				"dateTime": "2018-06-12T09:00:00+02:00",
				"timeZone": "Europe/Amsterdam"
			},
			"end": {
				"dateTime": "2018-06-12T10:00:00+02:00",
				"timeZone": "Europe/Amsterdam"
			},
			"iCalUID": "6go3gor461im2b9o6gq3cb9k74r3abb268sjeb9j6csm6ohh71gjadho6s@google.com",
			"sequence": 0,
			"reminders": {
				"useDefault": true
			}
		},
		{
			"kind": "calendar#event",
			"etag": "\"2942208105280000\"",
			"id": "kkh8b8og88lkp1j6jc5o9efnmo_20180616T070000Z",
			"status": "confirmed",
			"htmlLink": "https://www.google.com/calendar/event?eid=a2toOGI4b2c4OGxrcDFqNmpjNW85ZWZubW9fMjAxODA2MTZUMDcwMDAwWiBtaWNoYWVsdmFubUBt",
			"created": "2014-12-05T23:05:51.000Z",
			"updated": "2017-03-08T15:18:59.148Z",
			"summary": "Werken",
			"colorId": "7",
			"creator": {
				"email": "michaelvanm@gmail.com",
				"displayName": "Michael van Meerwijk",
				"self": true
			},
			"organizer": {
				"email": "michaelvanm@gmail.com",
				"displayName": "Michael van Meerwijk",
				"self": true
			},
			"start": {
				"dateTime": "2018-06-16T09:00:00+02:00",
				"timeZone": "Africa/Ceuta"
			},
			"end": {
				"dateTime": "2018-06-16T17:00:00+02:00",
				"timeZone": "Africa/Ceuta"
			},
			"recurringEventId": "kkh8b8og88lkp1j6jc5o9efnmo",
			"originalStartTime": {
				"dateTime": "2018-06-16T09:00:00+02:00",
				"timeZone": "Africa/Ceuta"
			},
			"visibility": "public",
			"iCalUID": "kkh8b8og88lkp1j6jc5o9efnmo@google.com",
			"sequence": 1,
			"reminders": {
				"useDefault": false
			}
		},
		{
			"kind": "calendar#event",
			"etag": "\"3053678293537000\"",
			"id": "60q62cb5chhj6b9mcco3ib9kc8sj0bb274sm8b9k75gj0d1n71gjap1pc8",
			"status": "confirmed",
			"htmlLink": "https://www.google.com/calendar/event?eid=NjBxNjJjYjVjaGhqNmI5bWNjbzNpYjlrYzhzajBiYjI3NHNtOGI5azc1Z2owZDFuNzFnamFwMXBjOCBtaWNoYWVsdmFubUBt",
			"created": "2018-05-20T17:59:06.000Z",
			"updated": "2018-05-20T17:59:06.917Z",
			"summary": "zondag 17 juni amazon prime opzeggen",
			"creator": {
				"email": "michaelvanm@gmail.com",
				"displayName": "Michael van Meerwijk",
				"self": true
			},
			"organizer": {
				"email": "michaelvanm@gmail.com",
				"displayName": "Michael van Meerwijk",
				"self": true
			},
			"start": {
				"date": "2018-06-17"
			},
			"end": {
				"date": "2018-06-18"
			},
			"iCalUID": "60q62cb5chhj6b9mcco3ib9kc8sj0bb274sm8b9k75gj0d1n71gjap1pc8@google.com",
			"sequence": 0,
			"reminders": {
				"useDefault": false,
				"overrides": [
					{
						"method": "popup",
						"minutes": 900
					}
				]
			}
		},
		{
			"kind": "calendar#event",
			"etag": "\"3055000917416000\"",
			"id": "60rmcc1gc8r3ibb675i3cb9kc4pjabb168s3ab9n6oq3ad35c5gj8ob36s",
			"status": "confirmed",
			"htmlLink": "https://www.google.com/calendar/event?eid=NjBybWNjMWdjOHIzaWJiNjc1aTNjYjlrYzRwamFiYjE2OHMzYWI5bjZvcTNhZDM1YzVnajhvYjM2cyBtaWNoYWVsdmFubUBt",
			"created": "2018-05-28T09:40:58.000Z",
			"updated": "2018-05-28T09:40:58.708Z",
			"summary": "TEN Decision Making",
			"colorId": "6",
			"creator": {
				"email": "michaelvanm@gmail.com",
				"displayName": "Michael van Meerwijk",
				"self": true
			},
			"organizer": {
				"email": "michaelvanm@gmail.com",
				"displayName": "Michael van Meerwijk",
				"self": true
			},
			"start": {
				"dateTime": "2018-06-18T13:00:00+02:00",
				"timeZone": "Europe/Amsterdam"
			},
			"end": {
				"dateTime": "2018-06-18T15:00:00+02:00",
				"timeZone": "Europe/Amsterdam"
			},
			"iCalUID": "60rmcc1gc8r3ibb675i3cb9kc4pjabb168s3ab9n6oq3ad35c5gj8ob36s@google.com",
			"sequence": 0,
			"reminders": {
				"useDefault": true
			}
		},
		{
			"kind": "calendar#event",
			"etag": "\"2942208105280000\"",
			"id": "kkh8b8og88lkp1j6jc5o9efnmo_20180623T070000Z",
			"status": "confirmed",
			"htmlLink": "https://www.google.com/calendar/event?eid=a2toOGI4b2c4OGxrcDFqNmpjNW85ZWZubW9fMjAxODA2MjNUMDcwMDAwWiBtaWNoYWVsdmFubUBt",
			"created": "2014-12-05T23:05:51.000Z",
			"updated": "2017-03-08T15:18:59.148Z",
			"summary": "Werken",
			"colorId": "7",
			"creator": {
				"email": "michaelvanm@gmail.com",
				"displayName": "Michael van Meerwijk",
				"self": true
			},
			"organizer": {
				"email": "michaelvanm@gmail.com",
				"displayName": "Michael van Meerwijk",
				"self": true
			},
			"start": {
				"dateTime": "2018-06-23T09:00:00+02:00",
				"timeZone": "Africa/Ceuta"
			},
			"end": {
				"dateTime": "2018-06-23T17:00:00+02:00",
				"timeZone": "Africa/Ceuta"
			},
			"recurringEventId": "kkh8b8og88lkp1j6jc5o9efnmo",
			"originalStartTime": {
				"dateTime": "2018-06-23T09:00:00+02:00",
				"timeZone": "Africa/Ceuta"
			},
			"visibility": "public",
			"iCalUID": "kkh8b8og88lkp1j6jc5o9efnmo@google.com",
			"sequence": 1,
			"reminders": {
				"useDefault": false
			}
		}
	]
};