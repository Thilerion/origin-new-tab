import Vue from 'vue'
import App from './App.vue'
import store from './store';
import { i18n } from '@/i18n';

import Shortcut from '@/utils/keyShortcuts';
const s = new Shortcut().init();
s.add({ keys: ['c'], fn: () => console.log('C KEY WAS PRESSED!') });
s.add({ keys: ['c', 'a'], fn: () => console.log('C and A KEY WAS PRESSED!') });
s.add({ keys: ['b'], scope: 'base', fn: () => console.log('b was pressed in base scope') });
console.log(s.listenForKeys);

if (window && window.chrome && chrome.i18n && chrome.i18n.getMessage) {
	document.title = chrome.i18n.getMessage("extTitle");
}

import './assets/style/base.css';

import resizeDirective from '@/plugins/onResize';
Vue.use(resizeDirective, {
	throttleType: 'debounce',
	throttleOpts: {
		wait: 200,
		options: {
			maxWait: 1000
		}
	}
});

import focusDirective from '@/plugins/focus';
Vue.use(focusDirective);

import BaseFadeTransition from '@/components/BaseFadeTransition.vue';
Vue.component('BaseFadeTransition', BaseFadeTransition);

Vue.config.productionTip = false;
Vue.config.performance = true;

new Vue({
	store,
	i18n,
  	render: h => h(App)
}).$mount('#app')