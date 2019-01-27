import SvgIcon from '@/components/shared/SvgIcon';
import TransitionExpand from '@/components/shared/TransitionExpand';

export default {
	install(Vue) {
		Vue.component('svg-icon', SvgIcon);
		Vue.component('transition-expand', TransitionExpand);
	}
}