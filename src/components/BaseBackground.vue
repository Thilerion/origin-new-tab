<template>
	<div class="background-wrapper">
		<transition :name="transitionName" :appear="canAnimate">
			<component
				v-if="wallpaperComponent"
				:is="wallpaperComponent"
				class="background-image"
				@loadError="setDefaultWallpaper"
			/>
			<div class="loading" v-else>
				<span>Loading...</span>
			</div>
		</transition>
	</div>
</template>

<script>
import WallpaperDefault from './WallpaperDefault.vue';

import {loadWidget as loadUnsplash} from '@/widgets/WallpaperUnsplash/index.js';
const unsplashComponent = loadUnsplash();

export default {
	components: {
		WallpaperDefault
	},
	data() {
		return {
			canAnimate: false,
			wallpaperComponent: unsplashComponent
		}
	},
	computed: {
		transitionName() {
			/**
			 * Determines whether to show a transition on component change
			 * The wallpaperComponent itself determines if it should 
			 * 		transition on wallpaper changing
			 */
			if (this.canAnimate) {
				return 'fade';
			} else {
				return;
			}
		}
	},
	methods: {
		setDefaultWallpaper() {
			this.canAnimate = false;
			this.wallpaperComponent = 'WallpaperDefault';
			this.$nextTick(() => {
				this.canAnimate = true;
			})
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.canAnimate = true;
		})
	}
}
</script>

<style scoped>
.background-wrapper {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}

.loading {
	color: black;
	display: flex;
	height: 100%;
}

.loading > span {
	margin: auto;
}
</style>

<style>
.background-image {
	position: fixed;
	top: 0; bottom: 0;
	left: 0; right: 0;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	z-index: -1;
}

.fade-enter-active {
	transition: opacity 0.75s ease-in, transform 0.75s ease-out;
}

.fade-leave-active {
	transition: opacity 1s ease-in;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}

.fade-enter {
	transform: scale(1.1);
}
</style>
