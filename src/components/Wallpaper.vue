<template>
	<transition :name="animateName">
		<div
			v-if="showAny && currentLoadedURL"
			class="background-image"
			:key="currentLoadedURL"
			:style="[backgroundStyle]"
		></div>
	</transition>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
	data() {
		return {
			animate: false,
			currentLoadedURL: "",
			nextLoadedURL: "",

			currentLoadFailures: 0,
			maxLoadFailures: 3
		}
	},
	computed: {
		...mapGetters('wallpaper', [
			'dataLoadSuccessful',
			'dataLoadFailed',
			'showAny',
			'currentWallpaper',
			'nextWallpaper'
		]),
		currentWallpaperURL() {
			return this.currentWallpaper.url;
		},
		nextWallpaperURL() {
			if (this.nextWallpaper) return this.nextWallpaper.url;
		},




		backgroundStyle() {
			return {'background-image': `url(${this.currentLoadedURL})`};
		},
		animateName() {
			if (this.currentLoadedURL && this.animate) {
				return 'fade';
			}
		}
	},
	methods: {
		loadImage(url) {
			return new Promise((resolve, reject) => {
				const image = new Image();
				let loaded = () => {
					clearTimeout(loadTimer);
					loadTimer = null;
					resolve(url);
				}

				function errorLoading(e) {
					console.warn(e);
					reject("Error loading image");
				}
				function abortedLoading() {
					reject("Loading image aborted");
				}
				function timedOutLoading() {
					reject("Loading image timed out");
				}
				image.addEventListener('load', loaded);
				image.addEventListener('error', errorLoading);
				image.addEventListener('abort', abortedLoading);
				let loadTimer = setTimeout(() => {
					image.removeEventListener('load', loaded);
					image.removeEventListener('error', errorLoading);
					image.removeEventListener('abort', abortedLoading);
					image.src = "";
					timedOutLoading();
				}, 20000);

				image.src = url;
			})
		},
		async loadAndSetCurrent() {
			try {
				const url = this.currentWallpaperURL;
				if (!url) return;

				let loaded = await this.loadImage(url);
				this.currentLoadedURL = loaded;
				this.currentLoadFailures = 0;
			} catch (e) {
				this.currentLoadFailures += 1;
				console.warn("Problem loading current image URL!");
				console.warn(e);
			}	
		},
		async loadAndSetNext() {
			try {
				const url = this.nextWallpaperURL;
				if (!url) return;

				let loaded = await this.loadImage(url);
				this.nextLoadedURL = loaded;
			} catch(e) {
				console.warn("Problem loading next image URL!");
				console.warn(e);
			}
		},
		allowAnimateAfterFirstLoad() {
			setTimeout(() => {
				this.animate = true;
			}, 2000);
		}
	},
	created() {
		this.loadAndSetCurrent();
		this.loadAndSetNext();
		this.allowAnimateAfterFirstLoad();
	},
	watch: {
		currentWallpaperURL(newValue, oldValue) {
			// debugger;
			const current = this.currentLoadedURL;
			const next = this.nextLoadedURL;

			if (current === newValue) {
				// Current has not changed, so not going to load it
				return;
			} else if (newValue === next) {
				// Current is the same as the loaded next image, so setting next to current without loading it again
				this.currentLoadedURL = next;
			} else if (newValue && newValue !== oldValue) {
				//LOAD IMAGE
				this.loadAndSetCurrent();
			}
		},
		nextWallpaperURL(newValue, oldValue) {
			const current = this.currentLoadedURL;
			const next = this.nextLoadedURL;

			if (next === newValue) {
				// Next has not changed, so not going to load it
				return;
			} else if (newValue && newValue !== oldValue) {
				//LOAD IMAGE
				this.loadAndSetNext();
			}
		},
		currentLoadFailures(newValue, oldValue = 0) {
			console.warn(`Retries: ${this.currentLoadFailures} / ${this.maxLoadFailures}.`);
			if (newValue && newValue > oldValue) {
				console.warn("Apparently failed loading.");
				if (newValue < this.maxLoadFailures) {
					console.warn("There are retries left, so doing a retry now.");
					this.loadAndSetCurrent();
				} else {
					console.warn("Max retries reached, dispatch error to store.");
					this.$store.commit('wallpaper/setErrorLoadingImage', true);
				}
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
	box-shadow: inset 0 0 30vmax 5vmax rgba(0,0,0,.4);
	z-index: -1;
	filter: contrast(0.95) brightness(0.90);
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
