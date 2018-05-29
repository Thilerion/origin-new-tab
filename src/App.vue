<template>
	<div id="app">
		<StartWallpaper/>
		<StartGrid/>
	</div>
</template>

<script>
import StartWallpaper from "./components/Wallpaper.vue";
import StartGrid from './components/Grid.vue'

export default {
	name: "app",
	components: {
		StartWallpaper,
		StartGrid
	}
};
</script>

<style>
</style>
