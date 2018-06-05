<template>
	<transition
		:name="transitionName"
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
		}
	},
	computed: {
		transitionName() {
			if (this.fadein && this.fadeout) return 'widget-fade';
			if (this.fadein && !this.fadeout) return 'widget-fadein';
			if (!this.fadein && this.fadeout) return 'widget-fadeout';
		}
	}
}
</script>

<style>
.widget-fadein-enter-active, .widget-fade-enter-active, .widget-fade-leave-active, .widget-fadeout-leave-active {
	transition: opacity 0.3s ease;
}

.widget-fadein-enter, .widget-fade-enter, .widget-fade-leave-to, .widget-fadeout-leave-to {
	opacity: 0;
}
</style>
