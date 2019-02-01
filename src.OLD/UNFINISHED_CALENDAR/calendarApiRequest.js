import parse from 'date-fns/parse';
import addDays from 'date-fns/add_days';

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

async function calendarRequest({token}) {
	let headers = {
		Authorization: `Bearer ${token}`
	}
	
	let data = await calendarBaseRequest({headers});
	console.log(...logString('CALENDAR'), data.data);
	return data.data;
}

export { calendarRequest, calendarBaseRequest };