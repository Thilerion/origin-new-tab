<template>
	<button class="icon-btn settings-btn" @click="toggleSettings">
		<StartSvgIcon icon="cog" size="24px" />
	</button>	
</template>

<script>
export default {
	methods: {
		toggleSettings() {
			this.$store.commit('toggleSettings', true);
		}
	}
}
</script>

<style scoped>
.settings-btn {
	margin: auto 0 0 auto;
	padding: 0;
	background: none;
	border: none;
	color: inherit;
	min-width: 24px;
	width: 24px;
	height: 24px;
	position: relative;
	bottom: -8px;
	right: -4px;
	opacity: 0.4;
}

.settings-btn:hover {
	opacity: 1;
}
</style>
