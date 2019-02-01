const News = () => import(/* webpackChunkName: 'News'*/'./News.vue');

import newsConfig from './config.js';

export {News, newsConfig};