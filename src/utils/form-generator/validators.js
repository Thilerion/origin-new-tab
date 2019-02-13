const validators = {
	string(value, field) {
		if (field.required && !value) return false;
		if (typeof value !== 'string') return false;


		if (field.min && value.length < field.min) return false;
		if (field.max && value.length > field.max) return false;
		
		return true;
	}
}

export default validators;