import lodashMerge from 'lodash.merge';

export default function (defaultSettings, oldUserData) {
	let oldData = JSON.parse(oldUserData);
	let defaultData = defaultSettings;

	const newData = { general: {}, greeting: {}, widgets: [] };
	
	if (oldData.language) newData.general.language = oldData.language;
	if (oldData.username) newData.greeting.username = oldData.username;
	if (oldData.user) newData.greeting.username = oldData.user;
	if (oldData.fontSize) newData.general.fontSize = oldData.fontSize;
	if (oldData.widgets) newData.widgets = oldData.widgets;

	console.warn("Getting old SP_USER data and converting it to SP_SETTINGS data");
	console.log(defaultData, newData);
	const merged = lodashMerge(defaultData, newData);
	return merged;
}