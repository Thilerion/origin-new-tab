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
import storeModule from './store.js';

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
		if (!this.canShow) {
			this.$store.dispatch('unsplash/fetchApiData');
		} else {
			console.log("Unsplash component: not fetching data because data already fetched");
		}
	},
	watch: {
		errorLoading: {
			handler(newValue, oldValue) {
				if (newValue) {
					console.log("Emitting load errorr");
					this.$emit('loadError');
				}
			},
			immediate: true
		}
	}
}
</script>

<style scoped>

</style>
