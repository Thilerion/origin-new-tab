<template>
	<div class="setting-item">
		<h3 class="setting-item-heading"><slot name="header"/></h3>
		<slot />
	</div>
</template>

<script>
export default {

}
</script>

<style scoped>
.setting-item {
	margin-bottom: 1rem;
}

.setting-item-heading {
	line-height: 24px;
}
</style>
