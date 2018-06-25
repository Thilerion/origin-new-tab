import { baseRequest, calendarBaseRequest } from './config.api';

const logString = moduleName => [`%cRequest complete from "${moduleName}", with the following data:\n`, "color: white; background-color: #089108; line-height: 1.5; font-weight: bold;"];

export async function quoteRequest({category}) {
	let url = category
		? `/quote/${category}`
		: `/quote`;
	
	let data = await baseRequest({url});
	console.log(...logString('QUOTE'), data.data);
	return data.data;
}

export async function wallpaperRequest({collection}) {
	let url = `/wallpapers/${collection}`;
	
	let data = await baseRequest({url});
	console.log(...logString('WALLPAPER'), data.data);
	return data.data;
}

export async function weatherRequest({latitude, longitude}) {
	let url = `/forecast/${latitude}/${longitude}`;
	
	let data = await baseRequest({url});
	console.log(...logString('WEATHER'), data.data);
	return data.data;
}

export async function locationRequest({address}) {
	let url = `/location`;
	let params = { address };
	
	let data = await baseRequest({url, params});
	console.log(...logString('LOCATION'), data.data);
	return data.data;
}

export async function newsRequest() {
	let url = `/news`;
	
	let data = await baseRequest({url});
	console.log(...logString('NEWS'), data.data);
	return data.data;
}

export async function calendarRequest({token}) {
	let headers = {
		Authorization: `Bearer ${token}`
	}
	
	let data = await calendarBaseRequest({headers});
	console.log(...logString('CALENDAR'), data.data);
	return data.data;
}