<template>
	<div class="background-wrapper" :class="{vignette: showVignette}">
		<component
			v-if="wallpaperComponent"
			:is="wallpaperComponent"
			class="background-image"
			@loadError="wallpaperErrorEvent"
		/>
		<div class="loading" v-else>
			<span>Loading...</span>
		</div>
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
			showVignette: true,
			wallpaperError: false,
			wallpaperComponents
		}
	},
	computed: {
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
			this.wallpaperError = true;
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
}

.vignette .background-image {
	box-shadow: inset 0 0 40vmin 10vmin rgba(0, 0, 0, 0.3);
	filter: contrast(0.9) brightness(0.90);
}
</style>
