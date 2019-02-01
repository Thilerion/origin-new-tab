<template>
	<transition
		:name="transitionName"
		:appear="canAnimate"
	>
		<div
			:style="[wallpaperStyle]"
			v-show="canShow"
		></div>
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
			return {'background-image': `url(${this.currentWallpaperUrl})`};
		},
		canShow() {
			return this.$store.getters['unsplash/showComponent'];
		},
		currentWallpaper() {
			return this.$store.getters['unsplash/currentWallpaper'];
		},
		currentWallpaperUrl() {
			if (!this.currentWallpaper) return '';
			return this.currentWallpaper.url;
		},
		errorLoading() {
			return this.$store.getters['unsplash/errorLoading'];
		}
	},
	beforeMount() {
		this.$store.dispatch('unsplash/fetchApiData');
	},
	watch: {
		errorLoading(newValue, oldValue) {
			if (newValue) {
				console.log("Emitting load error");
				this.$emit('loadError');
			}
		}
	}
}
</script>

<style scoped>

</style>
