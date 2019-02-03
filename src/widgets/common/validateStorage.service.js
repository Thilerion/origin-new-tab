export default function validateStorageData(toValidate, moduleConfig) {
	const { moduleData: validators } = moduleConfig;
	
	const validatedData = {};
	const errors = [];

	const errorForRequired = key => {
		errors.push({ key, wasRequired: true });
		// get all defaultValues instead
	}

	const errorWithDefaultValue = (key, defaultValue) => {
		errors.push({ key, wasRequired: false });
		validatedData[key] = defaultValue;
	}

	for (const key in validators) {
		const { validate: validatorFn, required, defaultValue: getDefaultValue } = validators[key];
		// check if data to validate has key
		const dataHasKey = toValidate.hasOwnProperty(key);
		const propData = toValidate[key];

		if (!dataHasKey || !validatorFn(propData, toValidate)) {
			// no useful value can be used
			// check if required, if not use the default
			if (required) {
				errorForRequired(key);
			} else {
				const defVal = getDefaultValue(toValidate);
				errorWithDefaultValue(key, defVal);
			}
		} else {
			validatedData[key] = propData;
		}
	}

	return { validatedData, errors };
}