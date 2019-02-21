import Vue from 'vue';
import store from '@/store';
import { getLocaleFromStore } from '@/utils/locale';
import VueI18n from 'vue-i18n';
import messages from './messages.js';

Vue.use(VueI18n);

const i18n = new VueI18n({
	locale: getLocaleFromStore(store),
	fallbackLocale: 'en',
	messages
});

function changeLocale(locale = 'en') {
	i18n.locale = locale;
	console.log(`Locale changed to "${locale}".`);
	return true;
}

export { i18n, changeLocale };