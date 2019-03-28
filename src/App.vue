<template>
	<div id="app" :class="{ready: pageReady}">
		<BaseBackground />
		<BaseGrid />
		<SettingsModal v-if="showSettings" />
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
		showSettings() {
			return this.$store.state.ui.showSettings;
		}
	},
	created() {
		if (document.location.hash.includes('settings')) {
			this.$store.commit('setShowSettingsOverlay');
			setTimeout(() => {
				let title;
				try {
					title = chrome.i18n.getMessage("extTitle");
				} catch(e) {
					title = document.title;
				}
				history.replaceState("", title, ".");
			}, 100)
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