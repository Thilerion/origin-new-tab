export const getFromStorage = key => {
	try {
		const data = JSON.parse(localStorage.getItem(key));
		return data;
	} catch (e) {
		return {};
	}
}

export const saveToStorage = (key, data) => {
	try {
		const str = JSON.stringify(data);
		return localStorage.setItem(key, str);
	} catch (e) {
		return false;
	}
}