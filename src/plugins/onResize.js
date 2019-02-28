import _throttle from 'lodash.throttle';
import _debounce from 'lodash.debounce';
import _merge from 'lodash.merge';

import ResizeObserver from 'resize-observer-polyfill';

function parseOptions(opts) {
	if (!opts.value && typeof opts.value !== 'function') {
		console.error(`[OnResize Directive]: value is not a function (typeof ${typeof opts.value})`);
		return false;
	}
	return true;
}

function createThrottledCallback(fn, type, options = {}) {
	if (type === 'debounce') {
		return _debounce(fn, options.wait, options.options);
	} else if (type === 'throttle') {
		return _throttle(fn, options.wait, options.options);
	} else {
		return fn;
	}
}

const plugin = {
	ro: null,
	roCallbacks: new WeakMap(),
	
	globalOptions: {
		throttleType: 'debounce', // debounce or throttle or null
		throttleOpts: {
			wait: 100,
			options: {
				maxWait: 1000
			}
		}
	},

	opts: {},

	install(Vue, options = {}) {
		if (options.throttleType === undefined) {
			plugin.opts = { ...plugin.globalOptions };
		} else if (options.throttleType === null) {
			plugin.opts = { throttleType: null };
		} else {
			plugin.opts = _merge(plugin.globalOptions, options);
		}
		
		Vue.directive('resize', {

			inserted(el, binding) {
				if (!parseOptions(binding)) {
					return;
				}
		
				const cb = binding.value;
				const throttledCb = plugin.opts.throttleType ?
					createThrottledCallback(cb, plugin.opts.throttleType, plugin.opts.throttleOpts) : cb;
		
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