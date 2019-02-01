import _merge from 'lodash.merge';

import baseModule from './baseModule.js';
import { MIXIN_TYPES, storeMixins } from './mixins.js';

/**
 * Takes a base module, and merges in the mixins first, then the widget-specific options
 * @param {Object} widgetOptions - Widget-specific options for which no mixin is available
 * @param {Array} mixins - Mixins for storeModules that add specific state-properties, getters, mutations and/or actions
 * @returns {Object} StoreModule for this widget
 */
function createWidgetModule({mixins = [], widgetOptions = {}} = {}) {
	const mixinObjs = mixins.map(n => {
		let curMixin = n;

		if (typeof n === "string" && MIXIN_TYPES.includes(n)) {
			curMixin = storeMixins[n];
		} else if (typeof n === "string") {
			console.log(`StoreModule mixin with name ${String(n)} is not a valid mixin.`);
			return {};
		}

		return curMixin;
	});

	return _merge(baseModule, ...mixinObjs, widgetOptions);
}

export { createWidgetModule, MIXIN_TYPES };