import axios from "axios";

import isToday from "date-fns/is_today";
import differenceInDays from "date-fns/difference_in_calendar_days";
import format from "date-fns/format";
import isBefore from "date-fns/is_before";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import compareAsc from "date-fns/compare_asc";
import isEqual from 'date-fns/is_equal'
import parse from 'date-fns/parse';

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
		token: null,
		events: [
			{
				start: "2018-06-09T06:30:00.000Z",
				end: "2018-06-09T19:15:00.000Z",
				summary: "Ergens vandaag housewarming Wanda en Marco",
				allDay: false
			},
			{
				start: "2018-06-09T07:00:00.000Z",
				end: "2018-06-09T15:00:00.000Z",
				summary: "Werken",
				allDay: false
			},
			{
				start: "2018-06-11T00:00:00.000Z",
				end: "2018-06-12T00:00:00.000Z",
				summary:
					"19 juni deadline opgeven ESCAN Satellite on Cognitive Enhancement",
				allDay: true
			},
			{
				start: "2018-06-11T07:00:00.000Z",
				end: "2018-06-11T08:00:00.000Z",
				summary:
					"t1",
				allDay: false
			},
			{
				start: "2018-06-11T07:00:00.000Z",
				end: "2018-06-11T10:00:00.000Z",
				summary:
					"t2",
				allDay: false
			},
			{
				start: "2018-06-11T06:00:00.000Z",
				end: "2018-06-11T13:00:00.000Z",
				summary:
					"t3",
				allDay: false
			},
			{
				start: "2018-06-11T12:00:00.000Z",
				end: "2018-06-12T12:00:00.000Z",
				summary:
					"t4",
				allDay: true
			},
			{
				start: "2018-06-12T07:00:00.000Z",
				end: "2018-06-12T08:00:00.000Z",
				summary: "Kapper",
				allDay: false
			},
			{
				start: "2018-06-16T07:00:00.000Z",
				end: "2018-06-16T15:00:00.000Z",
				summary: "Werken",
				allDay: false
			},
			{
				start: "2018-06-17T00:00:00.000Z",
				end: "2018-06-18T00:00:00.000Z",
				summary: "zondag 17 juni amazon prime opzeggen",
				allDay: true
			},
			{
				start: "2018-06-18T11:00:00.000Z",
				end: "2018-06-18T13:00:00.000Z",
				summary: "TEN Decision Making",
				allDay: false
			},
			{
				start: "2018-06-23T07:00:00.000Z",
				end: "2018-06-23T15:00:00.000Z",
				summary: "Werken",
				allDay: false
			},
			{
				start: "2018-06-30T07:00:00.000Z",
				end: "2018-06-30T15:00:00.000Z",
				summary: "Werken",
				allDay: false
			},
			{
				start: "2018-06-30T15:00:00.000Z",
				end: "2018-06-30T19:00:00.000Z",
				summary: "Verjaardag Martijn Roest (surprise)",
				allDay: false
			}
		],
		calendarFormat: CALENDAR_FORMAT,
		timeFormat: TIME_FORMAT,
		calendarData: {
			permission: null
		}
	},

	getters: {
		token(state) {
			return state.token;
		},
		calendarWatch(state) {
			return state.calendarData;
		},
		calendarFormat(state) {
			return state.calendarFormat;
		},
		events(state) {
			return state.events;
		},
		eventsUpcomingWeek(state) {
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
		eventsByDay(state, getters) {
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
		permission(state) {
			return state.calendarData.permission;
		},
		widgetIsActive(state, getters) {
			let widgets = getters.widgets;
			return widgets.find(w => w.name === 'calendar').active;
		}
	},

	mutations: {
		setToken(state, token) {
			console.log("SETTING TOKEN: ", token);
			state.token = token;
		},
		setEvents(state, events) {
			state.events = [...events];
		},
		setHasPermission(state, bool) {
			state.calendarData.permission = bool;
		}
	},

	actions: {
		async getCalendarList({ getters, commit, dispatch }) {
			console.log("GETTING CALENDAR LIST");
			//https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=50&singleEvents=true&timeMin=2018-06-09T10%3A00%3A00Z
			try {
				let x = await axios.get(
					"https://www.googleapis.com/calendar/v3/calendars/primary/events",
					{
						params: {
							maxResults: 10,
							singleEvents: true,
							orderBy: "startTime",
							timeMin: parse("2018-06-08")
							//timeMax: new Date(Date.parse("2018-07-08")).toISOString()
						},
						headers: {
							Authorization: `Bearer ${getters.token}`
						}
					}
				);
	
				let events = [];
				x.data.items.forEach(event => {
					const start = event.start.dateTime
						? parse(event.start.dateTime).getTime()
						: parse(event.start.date).getTime();
					const end = event.end.dateTime
						? parse(event.end.dateTime).getTime()
						: parse(event.end.date).getTime();
	
					let eventObj = { start, end, summary: event.summary };
	
					if (event.start.date && !event.start.dateTime) {
						eventObj.allDay = true;
					} else eventObj.allDay = false;
	
					events.push(eventObj);
				});
				commit("setEvents", events);
				console.log(events);
			} catch (err) {
				console.warn("Error caught in getCalendarList...");
				console.log(err);
			}		
		},

		//NEW BELOW
		calendarStorageLoadFailed({ getters, commit, dispatch }) {
			dispatch('getGoogleAuthTokenSilent')
				.then(() => {
					if (getters.widgetIsActive && getters.token && getters.permission) {
						console.log("Widget is active", getters.widgetIsActive, "Token is here", getters.token, "Permission is here", getters.permission, "so loading data now");
					}
					dispatch('getCalendarList');
				})
		},
		calendarSetFromStorage({ getters, commit, dispatch }, calData) {
			if (calData.permission === true) {
				commit('setHasPermission', true);
				dispatch('getGoogleAuthTokenSilent')
					.then(() => {
						if (getters.widgetIsActive && getters.token && getters.permission) {
							console.log("Widget is active", getters.widgetIsActive, "Token is here", getters.token, "Permission is here", getters.permission, "so loading data now");
						}
						dispatch('getCalendarList');
					})
			} else {
				commit('setHasPermission', false);
			}			
		},
		getGoogleAuthTokenSilent({commit}) {
			return getAuthTokenSilent()
				.then(token => {
					commit('setToken', token);
					commit('setHasPermission', true);
				}).catch(err => {
					commit('setHasPermission', false);
					console.warn(err);
				})
		},
		getGoogleAuthTokenInteractive({commit}) {
			return getAuthTokenInteractive()
				.then(token => {
					commit("setToken", token);
					commit('setHasPermission', true);

				}).catch(err => {
					commit('setHasPermission', false);
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
				})
				.catch(err => {
					console.warn("ERROR IN REMOVING CACHED TOKEN: ", err);
				})
		}
	}
};

export default calendarStore;
