function mapKey(obj, cb) {
	const result = {};

	Object.keys(obj).forEach(key => {
		const value = obj[key];
		const resultingKey = cb(key);
		result[resultingKey] = value;
	})
	return result;
}

const toLowercase = val => val.toLowerCase();

export default (obj) => mapKey(obj, toLowercase);