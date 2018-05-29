<template>
	<div id="app">
		<StartWallpaper/>
		<StartGreeting/>
	</div>
</template>

<script>
import StartWallpaper from "./components/Wallpaper.vue";
import StartGreeting from "./components/greeting/Greeting.vue";

export default {
	name: "app",
	components: {
		StartWallpaper,
		StartGreeting
	}
};
</script>

<style>
</style>
