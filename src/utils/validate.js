const ERR_REQUIRED = 'Error: valid value is required';
const ERR_USE_DEFAULT = 'Error: invalid value, use default value';

class ValidateProp {
	constructor(validatorFn, required, defaultValueFn) {
		this._validate = validatorFn;
		this._required = required;
		this._getDefaultValue = defaultValueFn;
	}

	getAbsoluteDefault() {
		return this._getDefaultValue({});
	}

	validate(value, parentObj = {}) {
		const isValid = this._validate(value, parentObj);
		if (!isValid && this._required) {
			return { error: ERR_REQUIRED };
		} else if (!isValid) {
			return { value: this._getDefaultValue(parentObj) };
		} else if (isValid) {
			return { value };
		}
	}
}

export default class Validator {
	constructor(config) {
		this._config = config;
		this.validations = this._createValidations(this._config);
	}

	get dataDefaultValues() {
		const defaultData = {};
		Object.entries(this.validations).forEach(([key, val]) => {
			defaultData[key] = val.getAbsoluteDefault();
		})
		return defaultData;
	}

	_createValidations(config) {
		const entries = Object.entries(config);
		const obj = {}
		entries.forEach(([key, val]) => {
			const { required, validate, defaultValue } = val;
			obj[key] = new ValidateProp(validate, required, defaultValue);
		});
		return obj;
	}

	validate(toValidate) {
		const validatedData = {};

		if (!toValidate) {
			return this.dataDefaultValues;
		}

		for (const [key, val] of Object.entries(toValidate)) {
			const validated = val.validate(toValidate[key], toValidate);
			if (validated.error) {
				console.warn("Fatal error in validation, returning all defaults");
				return this.dataDefaultValues;
			} else {
				validatedData[key] = validated.value;
			}
		}

		return validatedData;
	}
}