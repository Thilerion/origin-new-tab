<template>
	<transition :name="animateName">
		<div
			v-if="wallpaperSource"
			class="background-image"
			:key="wallpaperSource"
			:style="[backgroundStyle]"
		></div>
	</transition>
</template>

<script>
export default {
	data() {
		return {
			animate: false
		}
	},
	computed: {
		backgroundStyle() {
			if (!this.wallpaperSource) return;
			return {'background-image': `url(${this.wallpaperSource})`};
		},
		wallpaperToShow() {
			return this.$store.getters.wallpaperToShow;
		},
		wallpaperSource() {
			const wp = this.wallpaperToShow;
			return (wp && wp.url) ? wp.url : null;
		},
		nextWallpaperUrl() {
			return this.$store.getters.nextWallpaperUrl;
		},
		animateName() {
			if (this.wallpaperToShow && this.animate) {
				return 'fade';
			}
		}
	},
	mounted() {
		setTimeout(() => {
			console.warn("timeout has passed, so wallpaper will now be animated");
			this.animate = true;
		}, 2000);
	}
}
</script>

<style scoped>
.background-image {
	position: fixed;
	top: 0; bottom: 0;
	left: 0; right: 0;
	background-size: cover;
	background-position: center;
	background-size: no-repeat;
	transform: scale(1.03);
	box-shadow: 0 0 20vmax rgba(0,0,0,0.4) inset;
	z-index: -1;
	filter: contrast(0.95) brightness(0.85);
}

.fade-enter-active {
	transition: opacity 0.75s ease-in;
}

.fade-leave-active {
	transition: opacity 1s ease-in;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}
</style>
