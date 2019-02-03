const ERR_REQUIRED = 'Error: valid value is required';
const ERR_USE_DEFAULT = 'Error: invalid value, use default value';

class ValidateProp {
	constructor(validatorFn, required, defaultValueFn) {
		this._validate = validatorFn;
		this._required = required;
		this._getDefaultValue = defaultValueFn;

		this.toValidate;
		this.parentObj;

		this.error;
	}

	setItem(val) {
		this.toValidate = val;
		return this;
	}

	setParent(val) {
		this.parentObj = val;
		return this;
	}

	validate() {
		const isValid = this.valid;

		if (isValid) {
			return { value: this.toValidate, error: null };
		} else if (!isValid && this.error === ERR_USE_DEFAULT) {
			return { value: this.defaultValue, error: this.error };
		} else if (!isValid && this.error === ERR_REQUIRED) {
			return { value: this.defaultValue, error: this.error };
		} else {
			console.error("Unreachable reached!");
		}
	}

	get defaultValue() {
		return this._getDefaultValue(this.parentObj);
	}

	get valid() {
		const valid = this._validate(this.toValidate, this.parentObj);

		if (!valid && this._required) {
			this.error = ERR_REQUIRED;
		} else if (!valid && !this._required) {
			this.error = ERR_USE_DEFAULT;
		}

		return !!valid;
	}
}

export default class Validator {
	constructor(config) {
		this._config = config;
		
		this.validations = this._createValidations(this._config);
		
		this.toValidate;
		this.errors;
		this.result;
	}

	_getAllDefaultValues() {
		const obj = {};
		for (const [key, val] of Object.entries(this.validations)) {
			val.setParent({})
			obj[key] = val.defaultValue;
		}
		return obj;
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

	setObjectToValidate(obj) {
		this.toValidate = obj;
		return this;
	}

	validate() {
		let result = {};
		let errors = {};

		for (const [key, val] of Object.entries(this.validations)) {
			const toValidateItem = this.toValidate[key];
			const {
				value,
				error
			} = val.setItem(toValidateItem).setParent(this.toValidate).validate();

			if (error === ERR_REQUIRED) {
				result = this._getAllDefaultValues();
				errors = { [key]: ERR_REQUIRED };
				break;
			} else {
				result[key] = value;
				if (error) {
					errors[key] = ERR_USE_DEFAULT;
				}
			}
		}
		this.result = result;
		this.errors = errors;
		return { result, errors };
	}
}