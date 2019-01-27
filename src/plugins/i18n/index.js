import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

import localeMessages from './locales';

import lsHelper from '../../utils/localStorage';

// TODO: import getUILanguage and use that as default if available
const currentLocale = lsHelper.getNestedItem('sp_settings', 'general.language', 'en');

const i18n = new VueI18n({
	locale: currentLocale,
	fallbackLocale: 'en',
	messages: localeMessages
})

function changeLocale(locale = 'en') {
	i18n.locale = locale;
	return true;
}

export { i18n, changeLocale };