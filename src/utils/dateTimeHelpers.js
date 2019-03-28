import {
	differenceInMilliseconds,
	addMinutes,
	format,
	startOfMinute
} from 'date-fns';

export const toLocaleDate = (dateObj, language) => dateObj.toLocaleDateString(language, {
	weekday: 'long',
	year: 'numeric',
	month: 'long',
	day: 'numeric'
});

export const toShortLocaleDate = (dateObj, language) => dateObj.toLocaleDateString(language, {
	year: 'numeric',
	month: 'short',
	day: 'numeric'
});

export const nextMinute = (dateObj) => {
	return startOfMinute(addMinutes(dateObj, 1));
}

export const msUntilNextMinute = dateObj => {
	const nextMin = nextMinute(dateObj);
	return Math.abs(differenceInMilliseconds(nextMin, dateObj));
}

export const formatTime = (dateObj, timeFormat) => format(dateObj, timeFormat);