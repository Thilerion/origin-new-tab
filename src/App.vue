<template>
	<div id="app">
		<StartWallpaper/>
		<StartGrid/>
		<WidgetFadeIn fadein fadeout>		
			<StartSettings v-if="showSettings" />
		</WidgetFadeIn>
	</div>
</template>

<script>
import StartWallpaper from "./components/Wallpaper.vue";
import StartGrid from './components/Grid.vue'
import StartSettings from './components/Settings.vue';

export default {
	name: "app",
	components: {
		StartWallpaper,
		StartGrid,
		StartSettings
	},
	computed: {
		showSettings() {
			return this.$store.getters.showSettings;
		}
	}
};
</script>

<style>
</style>
