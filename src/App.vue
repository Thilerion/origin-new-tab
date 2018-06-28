<template>
	<div id="app">
		<StartWallpaper/>
		<StartGrid/>
		<transition name="settings-transition">	
			<StartSettings v-if="showSettings" />
		</transition>
	</div>
</template>

<script>
import StartWallpaper from "./components/Wallpaper.vue";
import StartGrid from './components/Grid.vue'
import StartSettings from './components/Settings.vue';

import {mapState, mapGetters} from 'vuex';

export default {
	name: "app",
	components: {
		StartWallpaper,
		StartGrid,
		StartSettings
	},
	computed: {
		...mapState(['showSettings']),
		...mapGetters(['fontSize'])
	},
	methods: {
		setDocumentFontSize(px = null) {
			const doc = document.documentElement;
			console.log(doc);
			if (px === null) {
				doc.style.setProperty('--font-size', '100%');
			} else {
				doc.style.setProperty('--font-size', `${px}px`);
			}			
		}
	},
	watch: {
		fontSize(newValue, oldValue) {
			this.setDocumentFontSize(newValue);
		}
	},
	created() {
		this.setDocumentFontSize(this.fontSize);
	}
};
</script>

<style>
</style>
