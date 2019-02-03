export const ERR_REQUIRED = 'Error: valid value is required';
export const ERR_USE_DEFAULT = 'Error: invalid value, use default value';

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
			return { value: this._getDefaultValue(parentObj), error: ERR_USE_DEFAULT };
		} else if (isValid) {
			return { value };
		}
	}
}

export default class Validator {
	constructor(config) {
		this._config = config;
		this.validations = this._createValidations(this._config);
		this.error = null;
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

		for (const [key, val] of Object.entries(this.validations)) {
			const validated = val.validate(toValidate[key], toValidate);
			if (validated.error === ERR_REQUIRED) {
				console.warn("Fatal error in validation, returning all defaults");
				this.error = ERR_REQUIRED;
				return this.dataDefaultValues;
			} else {
				if (validated.error && validated.error === ERR_USE_DEFAULT) {
					console.warn(`Minor error with value for key "${key}: ${toValidate[key]}". Using default of ${validated.value}.`);
				}
				validatedData[key] = validated.value;
			}
		}

		this.error = null;
		return validatedData;
	}
}