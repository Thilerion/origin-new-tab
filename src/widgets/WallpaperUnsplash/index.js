import store from '@/store';

const module = () => import(/* webpackChunkName: 'unsplash' */'./store.js');
const component = () => import(/* webpackChunkName: 'unsplash' */'./main.vue');


function loadWidget() {
	if (!store.state.unsplash) {
		console.log("Registering unsplash store module.");
		module().then(m => store.registerModule('unsplash', m.default));
	}
	return component;
}

export { loadWidget };