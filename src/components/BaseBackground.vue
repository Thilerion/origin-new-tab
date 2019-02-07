<template>
	<div class="background-wrapper">
		<transition :name="transitionName">
			<component
				v-if="wallpaperComponent"
				:is="wallpaperComponent"
				class="background-image"
				@loadError="wallpaperErrorEvent"
			/>
			<div class="loading" v-else>
				<span>Loading...</span>
			</div>
		</transition>
	</div>
</template>

<script>
import WallpaperDefault from './WallpaperDefault.vue';
import { wallpaperComponents } from '@/widgets';

export default {
	components: {
		WallpaperDefault
	},
	data() {
		return {
			canAnimate: false,
			wallpaperError: false,
			wallpaperComponents
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
		},
		activeBgComponent() {
			return this.$store.state.grid.wallpaperWidget;
		},
		wallpaperComponent() {
			if (this.wallpaperError || !this.activeBgComponent || !Object.keys(this.wallpaperComponents).includes(this.activeBgComponent)) {
				return 'WallpaperDefault';
			} else {
				return this.wallpaperComponents[this.activeBgComponent];
			}
		}
	},
	methods: {
		wallpaperErrorEvent() {
			this.canAnimate = false;
			this.wallpaperError = true;
		}
	},
	mounted() {
		this.canAnimate = false;
	},
	watch: {
		wallpaperComponent(newValue, oldValue) {
			if (newValue !== oldValue && oldValue != null && !this.wallpaperError) {
				this.canAnimate = true;
				setTimeout(() => {
					this.canAnimate = false;
				}, 200);
			}
		}
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
