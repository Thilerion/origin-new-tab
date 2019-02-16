<template>
	<div class="widget-info">
		<span class="name">{{name | removeWidgetStr}}</span>
	</div>
</template>

<script>
export default {
	props: {
		name: String,
		uid: String,
		idx: Number,
		x: Number,
		y: Number,
		alignX: String,
		alignY: String,
		width: Number,
		height: Number
	},
	filters: {
		removeWidgetStr(val) {
			if (val.startsWith('Widget')) {
				return val.slice(6);
			}
			return val;
		}
	}
}
</script>

<style scoped>

</style>
