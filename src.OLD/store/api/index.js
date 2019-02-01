import { baseRequest } from './config.api';

const logString = moduleName => [`%cRequest complete from "${moduleName}", with the following data:\n`, "color: white; background-color: #089108; line-height: 1.5; font-weight: bold;"];

export async function quoteRequest({category}) {
	let url = category
		? `/quote/${category}`
		: `/quote`;
	
	let data = await baseRequest({url});
	console.log(...logString('QUOTE'), data.data);
	return data.data;
}

export async function wallpaperRequest({collection, lang}) {
	let url = `/wallpapers/${collection}`;
	
	let data = await baseRequest({url, params: {lang}});
	console.log(...logString('WALLPAPER'), data.data);
	return data.data;
}

export async function weatherRequest({latitude, longitude, units, lang}) {
	let url = `/forecast/${latitude}/${longitude}`;
	
	let data = await baseRequest({
		url,
		params: {
			units,
			lang
		}
	});
	console.log(...logString('WEATHER'), data.data);
	return data.data;
}

export async function locationRequest({address, lang}) {
	let url = `/location`;
	let params = { address, lang };
	
	let data = await baseRequest({url, params});
	console.log(...logString('LOCATION'), data.data);
	return data.data;
}

export async function newsRequest({ lang } = {}) {
	let url = `/news`;
	
	let data = await baseRequest({url, params: { lang }});
	console.log(...logString('NEWS'), data.data);
	return data.data;
}