<template>
	<div class="widget-base">
		<slot />
	</div>
</template>

<script>
export default {
	props: {
		widget: {
			type: Object,
			required: true
		}
	}
}
</script>

<style scoped>
.widget-base {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
