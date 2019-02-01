import store from '@/store';

const module = () => import(/* webpackChunkName: 'unsplash' */'./store.js');
const component = () => import(/* webpackChunkName: 'unsplash' */'./main.vue');

function loadWidget() {
	if (!store.state.unsplash) {
		console.log("Registering unsplash store module.");
		store.registerModule('unsplash', module);
	} else {
		console.log("Unsplash store module is already registered");
	}
	return component;
}

export { loadWidget };