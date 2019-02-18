<template>
	<div class="btn-wrapper">
		<button class="icon-btn" @click="openSettings">
			<IconSettings class="icon" />
		</button>
	</div>
</template>

<script>
import IconSettings from '@/assets/icons/ui/md-settings.svg';

export default {
	components: {
		IconSettings
	},
	methods: {
		openSettings() {
			this.$store.commit('setShowSettingsOverlay', true);
		}
	}
}
</script>

<style scoped>
.btn-wrapper {
	position: relative;
	bottom: -0.5rem;
	right: -0.5rem;
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
}

.icon-btn {
	opacity: 0.7;
	transition: opacity .25s ease;
}
.icon-btn:hover {
	opacity: 1;
}

.icon {
	width: 20px;
	height: 20px;
}
</style>
