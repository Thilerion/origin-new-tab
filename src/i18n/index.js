import Vue from 'vue';
import store from '@/store';
import { getLocaleFromStore } from '@/utils/locale';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
	en: {
		message: {
			hello: 'hello world'
		}
	},
	nl: {
		message: {
			hello: 'hallo wereld'
		}
	}
};

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