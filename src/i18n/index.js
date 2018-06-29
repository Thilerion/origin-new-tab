import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);

let currentLocale
try {
	currentLocale = localStorage.getItem('sp_settings').general.language;
} catch(e) {}

import localeEn from './locales/en';
import localeNl from './locales/nl';

const i18n = new VueI18n({
	locale: currentLocale || 'en',
	fallbackLocale: 'en',
	messages: {
		nl: { ...localeNl },
		en: { ...localeEn }
	}
})

console.log(i18n);

function changeLocale(locale = 'en') {
	i18n.locale = locale;
}

export { i18n, changeLocale };