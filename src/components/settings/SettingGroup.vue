<template>
	<div class="setting-group">
		<h2 class="setting-group-heading"><slot name="header" /></h2>
		<div class="setting-group-content">
			<slot/>
		</div>
	</div>
</template>

<script>
export default {

}
</script>

<style scoped>
.setting-group {
	display: flex;
	border-bottom: 1px solid rgba(255,255,255,0.4);
	margin-bottom: 1rem;
}

.setting-group-heading {
	flex: 0 0 15rem;
	font-size: 1.25rem;
	font-weight: normal;
	text-transform: capitalize;
}

.setting-group-content {
	flex: 1 1 auto;
	position: relative;
}
</style>
