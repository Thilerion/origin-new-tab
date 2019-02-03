import { default as Validator, ERR_REQUIRED } from '@/utils/validate.js';

const validatorConfigWithRequired = {
	name: {
		validate(val) {
			return String(val) === val && val.length > 0;
		},
		required: true,
		defaultValue: () => 'Default required name'
	},
	someNumber: {
		validate(val) {
			return Number.isInteger(val);
		},
		required: false,
		defaultValue: () => 20
	}
}

const validatorConfigWithParent = {
	someArray: {
		validate(val) {
			return Array.isArray(val) && val.length > 0;
		},
		required: true,
		defaultValue: () => [1, 2, 3, 4, 5]
	},
	someArrayIndex: {
		validate(val, { someArray }) {
			return Number.isInteger(val) && val >= 0 && val < someArray.length;
		},
		required: false,
		defaultValue: (parentObj) => {
			console.log(parentObj);
			return parentObj.someArray.length - 1
		}
	}
}

describe('Validator class', () => {

	let validator;

	it('returns correct default values', () => {
		validator = new Validator(validatorConfigWithRequired);
		expect(validator.dataDefaultValues).toEqual({
			name: 'Default required name',
			someNumber: 20
		})
	})

	it('correctly validates correct data', () => {
		validator = new Validator(validatorConfigWithRequired);
		const toValidate = {
			name: 'Some name',
			someNumber: 10
		};
		expect(validator.validate(toValidate)).toEqual(toValidate);
	})

	it('correctly assigns default value to invalid data that is not required', () => {
		validator = new Validator(validatorConfigWithRequired);
		const toValidate = {
			name: 'Some name',
			someNumber: null
		};
		const expected = {
			name: 'Some name',
			someNumber: 20
		}
		expect(validator.validate(toValidate)).toEqual(expected);
	})

	it('returns entire default values object if a required field is invalid', () => {
		validator = new Validator(validatorConfigWithRequired);
		const toValidate = {
			name: ['this', 'is', 'not', 'a', 'string'],
			someNumber: 10
		};
		const expected = {
			name: 'Default required name',
			someNumber: 20
		}
		expect(validator.validate(toValidate)).toEqual(expected);
	})

	it('views a missing property as invalid', () => {
		validator = new Validator(validatorConfigWithRequired);
		const toValidate = {};
		const expected = {
			name: 'Default required name',
			someNumber: 20
		}
		expect(validator.validate(toValidate)).toEqual(expected);
	})

	it('sets the error property on itself with an invalid required field', () => {
		validator = new Validator(validatorConfigWithRequired);
		validator.validate({});
		expect(validator).toHaveProperty('error', ERR_REQUIRED);
	})

	describe('using the parentObject in validating', () => {

		it('can use the parentObject in validations', () => {
			validator = new Validator(validatorConfigWithParent);
			const toValidate = {
				someArray: [1, 2, 3, 4, 5],
				someArrayIndex: 10
			};
			expect(validator.validate(toValidate).someArrayIndex).not.toEqual(toValidate);
		})
	
		it('can use the parentObject in determining the default value', () => {
			validator = new Validator(validatorConfigWithParent);
			const toValidate = {
				someArrayIndex: 10,
				someArray: [1, 2, 3, 4, 5]
			};
			const expected = {
				someArrayIndex: 4,
				someArray: [1, 2, 3, 4, 5]
			}
			expect(validator.validate(toValidate)).toEqual(expected);
		})
	})
})