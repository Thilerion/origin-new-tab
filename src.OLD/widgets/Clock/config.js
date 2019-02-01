import { stringField, booleanField } from '../common/createWidgetSettingFields';

const configWidgetSettings = [
	stringField({
		name: 'username',
		min: 1,
		max: 25,
		defaultValue: ''
	}),
	booleanField({
		name: 'showGreeting',
		defaultValue: true
	}),
	booleanField({
		name: 'showDate',
		defaultValue: false
	})
];

const config = {
	name: 'Clock',
	storeModule: false,
	api: false,
	component: true,
	widgetSettings: configWidgetSettings,
	displaySettings: {
		required: false,
		zIndex: 1,
		move: true,
		resize: true,
		align: true,
		vAlign: true,
		fontSize: {
			canChange: true,
			min: -8,
			max: 2
		}
	}
}

export default config;