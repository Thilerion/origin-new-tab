<template>
	<div id="app" :class="{ready: pageReady}" v-shortkey="['ctrl', ',']" @shortkey="$store.commit('setShowSettingsOverlay')">
		<BaseBackground />
		<BaseGrid />
		<SettingsModal v-if="enableSettingsModal" />
	</div>
</template>

<script>
import BaseBackground from '@/components/BaseBackground.vue';
import BaseGrid from '@/components/BaseGrid.vue';
import SettingsModal from '@/components/settings/SettingsModal.vue';

export default {
	name: "app",
	components: {
		BaseBackground,
		BaseGrid,
		SettingsModal
	},
	data() {
		return {
			pageReady: false
		}
	},
	computed: {
		enableSettingsModal() {
			return this.$store.state.showSettingsOverlay;
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