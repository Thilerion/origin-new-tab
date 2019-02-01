<template>
	<div id="app">
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
	computed: {

	},
	methods: {

	}
};
</script>

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