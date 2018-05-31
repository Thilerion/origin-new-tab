<template>
	<transition name="fade">
		<div
			v-if="wallpaperInitialized"
			class="background-image"
			:key="loadedImageSource"
			:style="[backgroundStyle]"
			:class="{animate: animate}"
		></div>
	</transition>
</template>

<script>
export default {
	data() {
		return {
			animate: false,
			loadedImageSource: null
		}
	},
	computed: {
		backgroundStyle() {
			if (!this.loadedImageSource) return;
			return {'background-image': `url(${this.loadedImageSource})`};
		},
		wallpaperSource() {
			let cur = this.$store.getters.currentWallpaper;
			try {
				return cur.url;
			}
			catch(e) {
				return "";
			}
		},
		wallpaperInitialized() {
			return this.$store.getters.wallpaperInitialized;
		},
		nextWallpaperUrl() {
			return this.$store.getters.nextWallpaperUrl;
		}
	},
	methods: {
		loadNewImage(src) {
			console.log("Loading new image source", src);
			this.isLoaded = false;
			const image = new Image();

			image.onload = () => {
				this.loadedImageSource = src;
				if (!this.animate) {
					setTimeout(() => {
						this.animate = true;
					}, 1000);
				}
			}
			image.src = src;
		},
		preloadImage(src) {
			let preloadImage = new Image();
			preloadImage.src = src;
		}
	},
	beforeMount() {
		this.loadNewImage(this.wallpaperSource);
		this.preloadImage(this.nextWallpaperUrl);
	},
	watch: {
		wallpaperSource(newVal, oldVal) {
			if (newVal) {				
				this.loadNewImage(newVal);
			}
		},
		nextWallpaperUrl(newVal, oldVal) {
			if (newVal !== oldVal && newVal !== this.wallpaperSource) {
				console.log(newVal + '\n', oldVal + '\n', this.wallpaperSource + '\n');
				this.preloadImage(newVal);
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
	filter: contrast(0.92) brightness(0.95);
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
