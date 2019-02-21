export default {
	install(Vue) {
		Vue.directive('focus', {
			inserted(el, binding) {
				if (binding.value) {
					el.setAttribute('tabindex', -1);
				}
				el.focus();
			}
		})
	}
}