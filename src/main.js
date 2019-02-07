import Vue from 'vue'
import App from './App.vue'
import store from './store'

import './assets/style/base.css';

import resizeDirective from '@/plugins/onResize';
Vue.use(resizeDirective, {
	doThrottle: true,
	throttleDuration: (1000 / 15)
});

Vue.config.productionTip = false

new Vue({
	store,
  	render: h => h(App)
}).$mount('#app')