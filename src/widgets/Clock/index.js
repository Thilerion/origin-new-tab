import component from './main.vue';
import { config } from './config.js';

import Widget from '../common/Widget.js';

const clockWidget = new Widget(config, component);
console.log(clockWidget);

export default clockWidget;