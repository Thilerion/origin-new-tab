import Vue from 'vue'
import App from './App.vue'
import store from './store'

import './assets/style/base.css';

import onResizeDirective from '@/plugins/onResize';
Vue.directive('resize', onResizeDirective);

Vue.config.productionTip = false

new Vue({
	store,
  	render: h => h(App)
}).$mount('#app')