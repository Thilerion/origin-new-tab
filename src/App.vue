<template>
	<div id="app">
		<StartWallpaper/>
		<StartGrid/>
		<WidgetFadeIn fadein fadeout>		
			<StartSettings v-if="showSettings" />
		</WidgetFadeIn>
	</div>
</template>

<script>
import StartWallpaper from "./components/Wallpaper.vue";
import StartGrid from './components/Grid.vue'
import StartSettings from './components/Settings.vue';

import {mapState} from 'vuex';

export default {
	name: "app",
	components: {
		StartWallpaper,
		StartGrid,
		StartSettings
	},
	computed: {
		...mapState('settings', {
			'showSettings': state => state.showSettings,
			'fontSize': state => state.settingsData.general.fontSize
		})
	},
	methods: {
		setDocumentFontSize(px) {
			if (!px) {
				document.documentElement.style.fontSize = ``;
			} else {
				document.documentElement.style.fontSize = `${px}px`;
			}			
		}
	},
	watch: {
		fontSize(newValue, oldValue) {
			this.setDocumentFontSize(newValue);
		}
	},
	beforeMount() {
		this.setDocumentFontSize(this.fontSize);
	}
};
</script>

<style>
</style>
