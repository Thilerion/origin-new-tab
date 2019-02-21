function createListener() {
	document.addEventListener('visibilitychange', changeHandler);
}

function changeHandler() {
	const state = (document.visibilityState === 'visible');
	const cbs = plugin.callbacks;
	iterateCallbacks(cbs, state);
}

function removeListener() {
	document.removeEventListener('visibilitychange', changeHandler);
}

function iterateCallbacks(cbs, visibility) {
	cbs.forEach((value, key) => {
		value(visibility);
	});
}


const plugin = {
	listening: false,
	callbacks: new Map(),
	
	install(Vue, options = {}) {
		Vue.directive('page-visibility', {
			inserted(el, binding) {
				const cb = binding.value;

				if (!cb && typeof cb !== 'function') {
					console.error(`[PageVisibility Directive]: value is not a function (typeof ${typeof cb})`);
					return;
				}

				plugin.callbacks.set(el, cb);

				if (!plugin.listening) {
					createListener();
					plugin.listening = true;
				}
			},
			unbind(el, binding) {

				plugin.callbacks.delete(el);

				if (plugin.callbacks.size === 0) {
					removeListener();
					plugin.listening = false;
				}
			}
		})
	}
}

export default plugin;