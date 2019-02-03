export const loadFromStorage = key => {
	try {
		const data = window.localStorage.getItem(key);
		return JSON.parse(data);
	} catch (e) {
		return false;
	}
}

export const saveToStorage = (key, data) => {
	try {
		const str = JSON.stringify(data);
		window.localStorage.setItem(key, str);
		return true;
	} catch (e) {
		return false;
	}
}