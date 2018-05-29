<template>
	<div>
		<button @click="nextWallpaper">Next</button>
	</div>
</template>

<script>
export default {
	methods: {
		nextWallpaper() {
			this.$store.commit('nextWallpaper');
		}
	}
}
</script>

<style scoped>

</style>
