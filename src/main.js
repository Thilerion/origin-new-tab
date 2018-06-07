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

Vue.directive('clamp', {
	inserted(el, binding, vnode) {
		let t = el.innerText;
		console.time(`clamp${t}`);
		window.setTimeout(() => {			
			const style = window.getComputedStyle(el);
			let line,
				h,
				w,
				maxLines,
				maxHeight,
				increment = 0;

			function updateValues() {
				line = style.getPropertyValue('line-height').slice(0, -2) * 1;
				h = style.getPropertyValue('height').slice(0, -2) * 1;
			}

			updateValues();
			maxLines = Math.max(Math.min(binding.value, 10), 0) || 2;
			maxHeight = maxLines * line;

			if (h <= maxHeight) { 
				console.timeEnd(`clamp${t}`);
				return;
			};
			
			function initialTruncate() {
				let txt = el.innerText;
				let curLines = h / line;
				let linesTooMany = curLines - maxLines - 1;
				if (linesTooMany < 1) return;
				
				let splitLength = txt.length;
				let removeFraction = (maxLines / curLines);
				let removeAmount = removeFraction * splitLength;
				el.innerText = `${txt.slice(0, removeAmount * -1)}`;
				updateValues();
			}

			initialTruncate();

			function truncate() {
				let txt = el.innerText;
				el.innerText = `${txt.slice(0, -10)}`;
			}

			while (h > maxHeight && increment < 20) {
				truncate();
				updateValues();
				increment += 1;
			}
			el.innerText = `${el.innerText}...`;
			console.timeEnd(`clamp${t}`);
		})
		
	}
})

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
