import SvgIcon from '@/components/shared/SvgIcon';
import TransitionExpand from '@/components/shared/TransitionExpand';

export default {
	install(Vue) {
		Vue.component('SvgIcon', SvgIcon);
		Vue.component('TransitionExpand', TransitionExpand);
	}
}