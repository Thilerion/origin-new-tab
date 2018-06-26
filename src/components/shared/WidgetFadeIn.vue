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
</style>
