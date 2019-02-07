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
		if (!parseOptions(binding)) {
			return;
		}

		const cb = binding.value;
		const throttledCb = _throttle(cb, 1000);

		if (!ro) {
			ro = new ResizeObserver(entries => {
				for (let entry of entries) {
					const el = entry.target;
					if (roCallbacks.has(el)) {
						const cb = roCallbacks.get(el);
						cb(entry.contentRect, entry.target);
					} else {
						console.warn(`[ResizeObserver]: no callback found for element: `, el);
					}
				}
			})
		}

		// console.log(`[OnResize Directive]: Setting callback for element, and start observing.`);
		roCallbacks.set(el, throttledCb);
		ro.observe(el);
	},

	unbind(el) {
		if (ro && roCallbacks.has(el)) {
			// console.log(`[OnResize Directive]: Deleting callback and unobserving element:`, el);
			roCallbacks.delete(el);
			ro.unobserve(el);
		} else if (ro) {
			console.warn(`[OnResize Directive]: Could not find callback for element, so can not delete it: `, el);
			ro.unobserve(el);
		} else {
			console.warn(`[OnResize Directive]: Could not find ResizeObserver, so cannot unobserve element: `, el);
		}
	}
}

export default onResizeDirective;