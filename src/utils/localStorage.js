import _get from 'lodash.get';

function isLocalStorage() {
	/**
	 * From Modernizr
	 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
	**/
	const test = 'test';
	try {
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch (e) {
		console.warn('Error in localStorage test function.');
		console.warn(e);
		return false;
	}
}

const QUOTA_EXCEEDED_ERRORS = ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'];

class Storage {
	constructor() {
		if (!isLocalStorage()) {
			throw new Error('No local storage available.');
		}
		this.data = {};
	}

	getItem(key) {
		if (this.data[key]) {
			return this.data[key];
		}

		try {
			let data = JSON.parse(localStorage.getItem(key));
			this.data[key] = data;
			return this.data[key];
		} catch (e) {
			console.error('Unexpected error in retrieving data from localStorage.', e);
			return false;
		}
	}

	setItem(key, data) {
		this.data[key] = data;

		try {
			let stringified = JSON.stringify(data);
			localStorage.setItem(key, stringified);
			return true;
		} catch (e) {
			if (QUOTA_EXCEEDED_ERRORS.includes(e.name)) {
				console.error('LocalStorage quota limit exceeded. Operation failed.');
			} else {
				console.error('Unexpected error in setting data to localStorage.', e);
			}
			return false;
		}
	}

	getNestedItem(key, path, defaultValue = null) {
		try {
			const data = this.getItem(key);
			return _get(data, path, defaultValue);
		} catch (e) {
			console.error('Could not retrieve data from path in localStorage.');
			return defaultValue;
		}
	}
}

const lsHelper = new Storage();
export default lsHelper;

export { Storage };