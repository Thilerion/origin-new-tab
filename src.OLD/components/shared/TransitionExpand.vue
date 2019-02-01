<template>
	<transition
		name="expand"
		@enter="enter"
		@after-enter="afterEnter"
		@leave="leave"
		transition-duration="300"
	>
		<slot/>
	</transition>
</template>

<script>
export default {
	name: 'TransitionExpand',
	methods: {
		enter(el) {
			el.style.width = getComputedStyle(el).width;
			el.style.position = 'absolute';
			el.style.visibility = 'hidden';
			el.style.height = 'auto';

			const height = getComputedStyle(el).height;

			el.style.width = null;
			el.style.position = null;
			el.style.visibility = null;
			el.style.height = 0;

			setTimeout(() => {
				el.style.height = height;
			})
		},
		afterEnter(el) {
			el.style.height = "auto";
		},
		leave(el) {
			const height = getComputedStyle(el).height;
			el.style.height = height;
			setTimeout(() => {
				el.style.height = 0;
			})
		}
	}
}
</script>

<style scoped>
* {
	will-change: height, opacity;
	transform: translateZ(0);
	backface-visibility: hidden;
	perspective: 1000px;
}

.expand-enter-active,
.expand-leave-active {
	transition: height 0.3s ease-in-out, opacity 0.3s ease;
	overflow: hidden;
}

.expand-enter,
.expand-leave-to {
	height: 0;
	opacity: 0;
}
</style>
