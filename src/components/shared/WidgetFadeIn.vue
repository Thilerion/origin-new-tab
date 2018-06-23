<template>
	<transition
		:name="transitionName"
		v-on="transitionHooks"
		mode="out-in"
	>
		<slot/>
	</transition>
</template>

<script>
export default {
	props: {
		fadein: {
			type: Boolean,
			default: true
		},
		fadeout: {
			type: Boolean,
			default: false
		},
		duration: {
			type: String,
			default: '500'
		}
	},
	computed: {
		transitionHooks() {
			let returnHooks = {};
			if (this.fadein) {
				returnHooks = {...returnHooks, beforeEnter: this.setDuration,
				afterEnter: this.removeDuration};
			}
			if (this.fadeout) {
				returnHooks = {...returnHooks, beforeLeave: this.setDuration,
				afterLeave: this.removeDuration};
			}
			return returnHooks;
		},
		transitionName() {
			if (this.fadein && this.fadeout) return 'widget-fade';
			if (this.fadein && !this.fadeout) return 'widget-fadein';
			if (!this.fadein && this.fadeout) return 'widget-fadeout';
		}
	},
	methods: {
		setDuration(el) {
			el.style.transitionDuration = `${this.duration}ms`;
		},
		removeDuration(el) {
			el.style.transitionDuration = "";
		}
	}
}
</script>

<style>
.widget-fadein-enter-active, .widget-fade-enter-active, .widget-fade-leave-active, .widget-fadeout-leave-active {
	transition-property: opacity;
	transition-timing-function: ease;
}

.widget-fadein-enter, .widget-fade-enter, .widget-fade-leave-to, .widget-fadeout-leave-to {
	opacity: 0;
}
</style>
