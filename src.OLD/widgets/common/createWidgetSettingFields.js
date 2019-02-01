const FIELD_TYPES = {
	STR: "Str",
	BOOL: "Bool",
	NUMBER: "Num",
	RADIO: "Radio",
	SELECT: "Select"
};

const stringField = ({ name, min = 0, max = 25, defaultValue = "" }) => ({
	name: String(name),
	type: FIELD_TYPES.STR,
	min: Number(min),
	max: Number(max),
	defaultValue: String(defaultValue)
});

const booleanField = ({ name, defaultValue = false }) => ({
	name: String(name),
	type: FIELD_TYPES.BOOL,
	defaultValue: !!defaultValue
});

const numberField = ({ name, min, max, defaultValue }) => ({
	name: String(name),
	type: FIELD_TYPES.NUMBER,
	min: Number(min),
	max: Number(max),
	defaultValue: Number(defaultValue)
});

const selectFieldOption = ({ name, value }) => ({
	name: String(name),
	value
});

const radioField = ({ name, values, defaultValue }) => ({
	name: String(name),
	type: FIELD_TYPES.RADIO,
	values: [...values],
	defaultValue: values.includes(defaultValue) ? defaultValue : values[0]
});

const selectField = ({ name, values, defaultValue }) => ({
	name: String(name),
	type: FIELD_TYPES.SELECT,
	values: [...values],
	defaultValue: values.includes(defaultValue) ? defaultValue : null
});

export { FIELD_TYPES, stringField, booleanField, numberField, selectFieldOption, radioField, selectField };
