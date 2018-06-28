async function getUILanguage() {
	if (!chrome || !chrome.i18n) return null;

	const uiLang = chrome.i18n.getUILanguage();
	
	return uiLang;
}

export default getUILanguage;