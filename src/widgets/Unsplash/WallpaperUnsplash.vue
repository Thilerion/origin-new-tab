<template>
	<transition :name="transitionName">
		<div
			:style="[wallpaperStyle]"
			:key="wallpaperSrc"
			v-if="canShow && !!wallpaperSrc"
		></div>
	</transition>
</template>

<script>
import {register, persist} from './store.js';
import EnableWidgetStore from '@/mixins/EnableWidgetStore';

import loadImage from '@/utils/loadImage';

export default {
	name: 'WallpaperUnsplash',
	mixins: [EnableWidgetStore({
		namespace: 'unsplash', register, persist
	})],
	data() {
		return {
			canAnimate: false,
			wallpaperSrc: null
		}
	},
	computed: {
		transitionName() {
			if (this.canAnimate) {
				return 'fade-bg-slow';
			} else {
				// return 'fade-bg';
				return;
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
			loadImage(this.nextWallpaperUrl).then(({url, image}) => {
				// console.log('Next wallpaper preloaded.');
			}).catch(e => {
				console.log('Could not preload next wallpaper.');
				console.error(e);
			})
		}
	},
	beforeMount() {
		this.canAnimate = false;
		setTimeout(() => {
			this.canAnimate = true;
		}, 200)
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

				loadImage(newValue).then(({url, image}) => {
					// console.log('Wallpaper was loaded! Setting it as wallpaperSrc now..');
					if (url !== this.currentWallpaperUrl) {
						console.warn("While loading, the current wallpaper changed...");
						return;
					}
					if (url !== this.wallpaperSrc) {
						this.wallpaperSrc = url;
					}
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
.fade-bg-enter-active, .fade-bg-leave-active {
	transition: opacity 0.15s ease-out;
}

.fade-bg-leave-to, .fade-bg-enter {
	opacity: 0;
}

.fade-bg-slow-enter-active, .fade-bg-slow-leave-active {
	transition: opacity 0.75s ease-in, transform 0.75s ease-out;
}

.fade-bg-slow-leave-to {
	opacity: 0;
}

.fade-bg-slow-enter {
	opacity: 0;
	transform: scale(1.1);
}
</style>
