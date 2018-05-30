<template>
<transition name="fade">
<div class="background-image" :key="loadedWallpaperUrl" :style="[backgroundStyle, blurStyle]" :class="{animate: animate}"></div>
</transition>
</template>

<script>
export default {
	data() {
		return {
			loadedWallpaperUrl: this.wallpaperUrl,
			animate: false
		}
	},
	computed: {
		backgroundStyle() {
			return {
				'background-image': `url(${this.loadedWallpaperUrl})`
			}
		},
		wallpaperUrl() {
			if (this.$store.getters.failedLoadingWallpaper === true) {
				return this.$store.getters.defaultWallpaper;
			} else if (this.$store.getters.failedLoadingWallpaper === null) {
				return;
			} else {
				return this.$store.getters.currentWallpaper.urls.custom;
			}
		},
		blur() {
			return this.$store.getters.isBlurred;
		},
		blurStyle() {
			if (this.blur) {
				return {
					'filter': 'contrast(0.9) brightness(0.90) blur(20px)',
					'transform': 'scale(1.1)'
				}
			} else {
				return {
					'filter': 'contrast(0.92) brightness(0.85)'
				}
			}		
		}
	},
	methods: {
		loadNewImage(src) {
			let self = this;
			let img = new Image();
			img.onload = function() {
				self.loadedWallpaperUrl = src;
				setTimeout(() => {
					self.animate = true;
				}, 1000);					
			}
			img.src = src;
		}
	},
	beforeMount() {
		this.loadNewImage(this.wallpaperUrl);
	},
	watch: {
		wallpaperUrl(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.loadNewImage(newVal);
			}
		}
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
}

.animate.fade-enter-active {
	transition: opacity 0.75s ease-in;
}

.animate.fade-leave-active {
	transition: opacity 1s ease-in;
}

.animate.fade-enter, .animate.fade-leave-to {
	opacity: 0;
}
</style>
