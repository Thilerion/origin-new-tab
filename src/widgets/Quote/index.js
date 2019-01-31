const Quote = () => import(/* webpackChunkName: 'Quote'*/'./Quote.vue');

import quoteConfig from './config.js';

export {Quote, quoteConfig};