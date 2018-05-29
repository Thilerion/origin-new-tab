import getHours from 'date-fns/get_hours';

function getTimeOfDay(date = new Date()) {
	const hours = getHours(date);

	// morning: 5 - 12
	// day: 12 - 18
	// evening: 18 - 00
	// night: 00 - 5

	if (hours < 5) return 3;
	if (hours < 12) return 0;
	if (hours < 18) return 1;
	return 2;
}

export default getTimeOfDay;