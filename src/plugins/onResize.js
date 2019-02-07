import _throttle from 'lodash.throttle';

// TODO: polyfill for firefox

let ro;
// Keep track of the callbacks for each individual element the directive is applied to
let roCallbacks = new WeakMap();

function parseOptions(opts) {
	if (!opts.value || typeof opts.value !== 'function') {
		console.error(`[OnResize Directive]: value is not a function (typeof ${typeof opts.value})`);
		return false;
	}
	return true;
}

const onResizeDirective = {
	inserted(el, binding) {
		
	},

	unbind(el) {
		
	}
}

const plugin = {
	ro: null,
	roCallbacks: new WeakMap(),
	
	globalOptions: {
		doThrottle: true,
		throttleDuration: 500
	},

	opts: {},

	install(Vue, options = {}) {
		const {
			doThrottle = plugin.globalOptions.doThrottle,
			throttleDuration = plugin.globalOptions.throttleDuration
		} = options;

		plugin.opts = { doThrottle, throttleDuration };
		
		Vue.directive('resize', {

			inserted(el, binding) {
				if (!parseOptions(binding)) {
					return;
				}
		
				const cb = binding.value;
				const throttledCb = plugin.opts.doThrottle ? _throttle(cb, plugin.opts.throttleDuration) : cb;
		
				if (!plugin.ro) {
					plugin.ro = new ResizeObserver(entries => {
						for (let entry of entries) {
							const el = entry.target;
							if (plugin.roCallbacks.has(el)) {
								const cb = plugin.roCallbacks.get(el);
								cb(entry.contentRect, entry.target);
							} else {
								console.warn(`[ResizeObserver]: no callback found for element: `, el);
							}
						}
					})
				}
		
				// console.log(`[OnResize Directive]: Setting callback for element, and start observing.`);
				plugin.roCallbacks.set(el, throttledCb);
				plugin.ro.observe(el);
			},

			unbind(el, binding) {
				if (plugin.ro && plugin.roCallbacks.has(el)) {
					// console.log(`[OnResize Directive]: Deleting callback and unobserving element:`, el);
					plugin.roCallbacks.delete(el);
					plugin.ro.unobserve(el);
				} else if (plugin.ro) {
					console.warn(`[OnResize Directive]: Could not find callback for element, so can not delete it: `, el);
					plugin.ro.unobserve(el);
				} else {
					console.warn(`[OnResize Directive]: Could not find ResizeObserver, so cannot unobserve element: `, el);
				}
			}
		})
	}
}

export default plugin;