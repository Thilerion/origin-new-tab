<template>
	<div class="grid">
		<StartGreeting/>
	</div>
</template>

<script>
import StartGreeting from "./widgets/Greeting.vue";

export default {
	components: {
		StartGreeting
	}
}
</script>

<style>
.grid {
	display: grid;
}
</style>
