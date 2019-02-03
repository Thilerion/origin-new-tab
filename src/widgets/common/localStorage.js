export function loadFromStorage(key) {
	const data = window.localStorage.getItem(key);
	if (data) return JSON.parse(data);
	else return false;
}

export function saveToStorage(key, data) {
	window.localStorage.setItem(key, JSON.stringify(data));
}