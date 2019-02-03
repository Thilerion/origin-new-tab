import storeModule from './store';
import component from './main.vue';
import { config } from './config.js';

import Widget from '../common/Widget.js';

const unsplashWidget = new Widget(config, component, storeModule);
console.log(unsplashWidget);

export default unsplashWidget;