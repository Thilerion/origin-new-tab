<template>
	<div id="app" :class="{ready: pageReady}">
		<BaseBackground />
		<BaseGrid />
	</div>
</template>

<script>
import BaseBackground from '@/components/BaseBackground.vue';
import BaseGrid from '@/components/BaseGrid.vue';

export default {
	name: "app",
	components: {
		BaseBackground,
		BaseGrid
	},
	data() {
		return {
			pageReady: false
		}
	},
	mounted() {		
		requestAnimationFrame(() => {
			this.pageReady = true;
		})
	}
};
</script>

<style scoped>
#app {
	opacity: 0;
	transition: opacity .25s ease;
}

#app.ready {
	opacity: 1;
}
</style>

<style>
.base-wallpaper {
	position: relative;
	z-index: 1;
}

.base-grid {
	position: relative;
	z-index: 1;
}

.base-settings {
	position: relative;
	z-index: 1;	
}
</style>