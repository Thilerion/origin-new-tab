<template>
	<div
		:style="{'background-image': `url(${this.src})`}"
	></div>
</template>

<script>
import defaultWallpaper from '@/assets/wallpaper/default_wallpaper.jpg';

export default {
	data() {
		return {
			src: defaultWallpaper
		}
	}
}
</script>

<style scoped>

</style>
