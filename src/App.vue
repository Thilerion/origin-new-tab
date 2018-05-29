<template>
	<div id="app">
		<StartWallpaper/>
		<StartWelcome/>
	</div>
</template>

<script>
import StartWallpaper from "./components/Wallpaper.vue";
import StartWelcome from "./components/Welcome.vue";

export default {
	name: "app",
	components: {
		StartWallpaper,
		StartWelcome
	}
};
</script>

<style>
</style>
