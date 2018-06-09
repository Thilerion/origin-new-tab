import axios from 'axios'

import isToday from 'date-fns/is_today';
import differenceInDays from 'date-fns/difference_in_calendar_days';
import format from 'date-fns/format';
import isBefore from 'date-fns/is_before'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

const CALENDAR_FORMAT = "dddd D MMMM";
const TIME_FORMAT = "HH:mm"

const calendarStore = {

	state: {		
		token: null,
		events: [],
		calendarFormat: CALENDAR_FORMAT,
		timeFormat: TIME_FORMAT
	},

	getters: {
		token(state) {
			return state.token;
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
				newEvent.endsToday = isToday(end) || (isToday(start) && newEvent.allDay);
				newEvent.daysFromToday = differenceInDays(start, today);
				newEvent.formattedDay = format(start, state.calendarFormat);
				newEvent.formattedTimeStart = format(start, state.timeFormat);
				newEvent.formattedTimeEnd = format(end, state.timeFormat);

				console.log(newEvent);

				acc.push(newEvent);
				return acc;
			}, [])
		}
	},

	mutations: {
		setToken(state, token) {
			state.token = token;
		},
		setEvents(state, events) {
			state.events = [...events];
		}
	},

	actions: {
		getGoogleAuthToken({ commit }) {
			if (!chrome || !chrome.identity) return;
			chrome.identity.getAuthToken({ interactive: true }, function (token) {
				commit('setToken', token);
			});
		},
		getGoogleAuthTokenOnStart({ commit }) {
			if (!chrome || !chrome.identity) return;
			chrome.identity.getAuthToken({interactive: false}, function(token) {
				commit('setToken', token);
			});
		},
		async getCalendarList({ getters, commit }) {
			//https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=50&singleEvents=true&timeMin=2018-06-09T10%3A00%3A00Z
			let x = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
				params: {
					maxResults: 10,
					singleEvents: true,
					orderBy: 'startTime',
					timeMin: new Date(Date.parse("2018-06-08")).toISOString(),
					//timeMax: new Date(Date.parse("2018-07-08")).toISOString()
				},
				headers: {
					Authorization: `Bearer ${getters.token}`
				}
			});

			let events = [];
			x.data.items.forEach(event => {
				const start = event.start.dateTime ? new Date(Date.parse(event.start.dateTime)) : new Date(event.start.date);
				const end = event.end.dateTime ? new Date(Date.parse(event.end.dateTime)) : new Date(event.end.date);

				let eventObj = { start, end, summary: event.summary };

				if (event.start.date && !event.start.dateTime) {
					eventObj.allDay = true;
				} else eventObj.allDay = false;

				events.push(eventObj)
			});
			commit('setEvents', events);
			console.log(events);
		}
	}

}

export default calendarStore;