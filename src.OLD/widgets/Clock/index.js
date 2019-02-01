const Clock = () => import(/* webpackChunkName: 'Clock'*/'./Clock.vue');

import clockConfig from './config.js';

export {Clock, clockConfig};