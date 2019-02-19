import { LANGUAGE_VALUES, LANGUAGE_DEFAULT } from '@/constants';

function getLocaleFromStore(store) {
	console.log('Getting locale from "store"');
	try {
		return store.state.settings.general.language;
	} catch (e) {
		return false;
	}
}

function getLocaleFromNavigator() {
	console.log('Getting locale from "navigator"');
	try {
		return navigator.language.slice(0, 2);
	} catch (e) {
		return false;
	}
}

function getLocaleFromChrome() {
	console.log('Getting locale from "chrome"');
	try {
		return getLocaleFromChrome.i18n.getUILanguage().slice(0, 2);
	} catch(e) {
		return false;
	}
}

function getDefaultLocale() {
	const language = getLocaleFromChrome() || getLocaleFromNavigator();
	if (LANGUAGE_VALUES.includes(language)) {
		console.log("Found language: ", language);
		return language;
	} else {
		console.warn(`Found language "${language}", but this is not a supported language. Defaulting to ${LANGUAGE_DEFAULT}.`);
		return LANGUAGE_DEFAULT;
	}
}

export { getLocaleFromStore, getDefaultLocale };
