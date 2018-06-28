import axios from 'axios';
import parse from 'date-fns/parse';
import addDays from 'date-fns/add_days';

const API_URL =
	process.env.NODE_ENV === 'development'
	? "http://localhost:3000"
	: "https://startpage-extension.herokuapp.com";

const baseRequest = axios.create({
	baseURL: API_URL,
	timeout: 20000,
	method: 'get'
})

const calendarBaseRequest = axios.create({
	url: "https://www.googleapis.com/calendar/v3/calendars/primary/events",
	params: {
		maxResults: 30,
		singleEvents: true,
		orderBy: "startTime",
		timeMin: parse(new Date().setHours(0, 0, 0, 0)),
		timeMax: addDays(new Date().setHours(0, 0, 0, 0), 14)
	},
	timeout: 20000,
	method: 'get'
});

export { baseRequest, calendarBaseRequest };