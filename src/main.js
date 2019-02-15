import Vue from 'vue'
import App from './App.vue'
import store from './store'

import VueShortkey from 'vue-shortkey';
Vue.use(VueShortkey, {
	prevent: ['input', 'textarea', 'button']
});

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
import pageVisibilityDirective from '@/plugins/pageVisibility';
Vue.use(pageVisibilityDirective);

import BaseFadeTransition from '@/components/BaseFadeTransition.vue';
Vue.component('BaseFadeTransition', BaseFadeTransition);

Vue.config.productionTip = false

new Vue({
	store,
  	render: h => h(App)
}).$mount('#app')