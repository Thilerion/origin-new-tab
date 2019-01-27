import Vue from 'vue'
import App from './App.vue'
import store from './store/'

import {i18n} from './i18n';

import './assets/style/base.css';

import baseComponents from './plugins/baseComponents';
Vue.use(baseComponents);

Vue.directive('focus', {
	inserted(el) {
		el.focus();
	}
})

Vue.config.productionTip = false

new Vue({
	store,
	i18n,
  	render: h => h(App)
}).$mount('#app')
