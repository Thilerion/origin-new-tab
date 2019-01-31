const Weather = () => import(/* webpackChunkName: 'Weather'*/'./Weather.vue');

import weatherConfig from './config.js';

export {Weather, weatherConfig};