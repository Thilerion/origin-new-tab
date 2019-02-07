import _get from 'lodash.get';

export function validateStoredSettings(stored, options) {
	const settings = {};

	for (const category in options) {
		const categoryOptions = options[category];
		const categoryData = {};

		for (const setting in categoryOptions) {
			const local = _get(stored, [category, setting]);
			if (!local) {
				const defaultValue = categoryOptions[setting].getDefault();
				// console.warn(`No local data found for setting [${category}][${setting}]. Using the default data instead:`, defaultValue);
				categoryData[setting] = defaultValue;
			} else {
				// console.log(`Found data for setting [${category}][${setting}]:`, local);
				categoryData[setting] = local;
			}
		}
		settings[category] = { ...categoryData };
	}
	return settings;
}