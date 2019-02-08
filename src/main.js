import Vue from 'vue'
import App from './App.vue'
import store from './store'

import VueShortkey from 'vue-shortkey';
Vue.use(VueShortkey, {
	prevent: ['input', 'textarea', 'button']
});

import './assets/style/base.css';

Vue.config.productionTip = false

new Vue({
	store,
  	render: h => h(App)
}).$mount('#app')