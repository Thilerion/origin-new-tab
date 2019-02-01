<template>
	<transition
		:name="transitionName"
		:appear="canAnimate"
	>
		<div
			:style="[wallpaperStyle]"
		>
			
		</div>
	</transition>
</template>

<script>
export default {
	name: 'WallpaperUnsplash',
	data() {
		return {
			canAnimate: false
		}
	},
	computed: {
		transitionName() {
			if (this.canAnimate) {
				return 'fade';
			}
		},
		wallpaperStyle() {
			return {'background-image': `url(${this.wallpaperSrc})`};
		}
	}
}
</script>

<style scoped>

</style>
