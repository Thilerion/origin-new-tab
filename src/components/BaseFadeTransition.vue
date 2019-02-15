<script>
const TYPES = [
	'fade'
]

export default {
	functional: true,
	render(h, context) {
		// console.log(context);

		const props = context.props || {};

		const type = (props.type && TYPES.includes(props.type)) ? props.type : 'fade';
		const mode = props.mode || undefined;

		const enterDur = props.enterDuration || props.duration || 200;
		const leaveDur = props.leaveDuration || props.duration || 200;

		const timingFn = props.timingFn;

		const data = {
			props: {
				name: type,
				mode,
				duration: { enter: enterDur, leave: leaveDur }
			},
			on: {
				beforeEnter(el) {
					el.style.transitionDuration = `${enterDur}ms`;
					if (timingFn) {
						el.style.transitionTimingFunction = timingFn;
					}
				},
				afterEnter(el) {
					el.style.transition = null;
				},
				beforeLeave(el) {
					el.style.transitionDuration = `${leaveDur}ms`;
					if (timingFn) {
						el.style.transitionTimingFunction = timingFn;
					}
				},
				afterLeave(el) {
					el.style.transition = null;
				}
			}
		};
		return h('transition', data, context.children);
	}
}
</script>


<style>
.fade-enter-active, .fade-leave-active {
	transition: opacity .2s ease;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}
</style>

