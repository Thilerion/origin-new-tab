import Vue from 'vue'
import App from './App.vue'
import store from './store/'

import './assets/style/base.css';

import StartSvgIcon from './components/shared/SvgIcon';
Vue.component('StartSvgIcon', StartSvgIcon);

import WidgetFadeInTransition from './components/shared/WidgetFadeIn';
Vue.component('WidgetFadeIn', WidgetFadeInTransition);

Vue.directive('focus', {
	inserted(el) {
		el.focus();
	}
})

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
