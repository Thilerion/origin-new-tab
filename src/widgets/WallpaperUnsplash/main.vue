<template>
	<transition
		:name="transitionName"
		:appear="canAnimate"
	>
		<div
			:style="[wallpaperStyle]"
			v-show="canShow && wallpaperSrc"
		></div>
	</transition>
</template>

<script>
import storeModule from './store.js';
import loadImage from './load-image.service.js';

export default {
	name: 'WallpaperUnsplash',
	data() {
		return {
			canAnimate: false,
			wallpaperSrc: null
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
		},
		canShow() {
			return this.$store.getters['unsplash/showComponent'];
		},
		currentWallpaper() {
			return this.$store.getters['unsplash/currentWallpaper'];
		},
		currentWallpaperUrl() {
			if (!this.currentWallpaper || !this.finishedLoading) return '';
			return this.currentWallpaper.url;
		},
		nextWallpaperUrl() {
			const next = this.$store.getters['unsplash/nextWallpaper'];
			if (next && next.url) {
				return next.url;
			}
		},
		errorLoading() {
			return this.$store.getters['unsplash/errorLoading'];
		},
		finishedLoading() {
			return this.$store.state.unsplash.finishedLoading;
		},
		dataHasLoaded() {
			return this.$store.state.unsplash.dataHasLoaded;
		}
	},
	methods: {
		preloadNext() {
			if (!this.nextWallpaperUrl) return;
			loadImage(this.nextWallpaperUrl).then(url => {
				console.log('Next wallpaper preloaded.');
			}).catch(e => {
				console.log('Could not preload next wallpaper.');
				console.error(e);
			})
		}
	},
	beforeMount() {
		this.$store.dispatch('unsplash/init');	
	},
	watch: {
		errorLoading: {
			handler(newValue, oldValue) {
				if (newValue) {
					console.log("Emitting load error");
					this.$emit('loadError');
				}
			},
			immediate: true
		},
		currentWallpaperUrl: {
			handler(newValue, oldValue) {
				if (!newValue || newValue === this.wallpaperSrc || !this.canShow) {
					return;
				}

				loadImage(newValue).then(url => {
					console.log('Wallpaper was loaded! Setting it as wallpaperSrc now..');
					if (url !== this.currentWallpaperUrl) {
						console.warn("While loading, the current wallpaper changed...");
						return;
					}
					this.wallpaperSrc = url;
					requestIdleCallback(() => {
						this.preloadNext();
					})
				}).catch(e => {
					console.log("Wallpaper image could not be loaded. Emitting load error.");
					this.$emit('loadError');
				})
			},
			immediate: true
		}
	}
}
</script>

<style scoped>

</style>
