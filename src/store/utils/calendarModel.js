import parse from 'date-fns/parse';
import differenceInDays from "date-fns/difference_in_calendar_days";
import isBefore from "date-fns/is_before";
import compareAsc from "date-fns/compare_asc";

const getHasEnded = (date) => isBefore(date, new Date());
const getDaysFromNow = (date) => differenceInDays(date, new Date());
const sortDay = (a, b) => {
	if (a.allDay || b.allDay) {
		return b.allDay - a.allDay;
	}
	const startDiff = compareAsc(a.start, b.start);
	return (startDiff === 0) ? compareAsc(a.end, b.end) : startDiff;
}

function createCalendarList(eventArray) {
	return eventArray.map(e => createEvent(e));
}

function createEvent(eventData) {
	return {
		start: parse(eventData.start.dateTime || eventData.start.date),
		end: parse(eventData.end.dateTime || eventData.end.date),
		allDay: !!eventData.start.date,
		summary: eventData.summary
	};	
}

function reduceCalendarList(eventArray, maxDaysDiff = 6) {
	//days from now
		//event sorted by start, then end
	const reduced = eventArray.map(e => {
		const hasEnded = getHasEnded(e.end);
		if (hasEnded) return null;
		const daysFromNow = getDaysFromNow(e.start);
		e.daysFromToday = daysFromNow;
		return e;
	}).reduce((acc, e) => {		
		if (!e || e.daysFromToday > maxDaysDiff) return acc;

		const day = Math.abs(e.daysFromToday);

		if (acc[day]) {
			acc[day].push(e);
		} else {
			acc[day] = [e];
		}
		return acc;
	}, {});
	
	for (const day in reduced) {
		reduced[day].sort(sortDay);
	}
	return reduced;
}

export { createCalendarList, reduceCalendarList };