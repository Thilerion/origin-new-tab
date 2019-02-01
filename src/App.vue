<template>
	<div id="app">
		<BaseBackground />
	</div>
</template>

<script>
import BaseBackground from '@/components/BaseBackground';

export default {
	name: "app",
	components: {
		BaseBackground
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