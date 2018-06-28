<template>
	<div id="app">
		<StartWallpaper class="base-wallpaper"/>
		<StartGrid class="base-grid" />
		<transition name="settings-transition">	
			<StartSettings class="base-settings" v-if="showSettings" />
		</transition>
	</div>
</template>

<script>
import StartWallpaper from "./components/Wallpaper.vue";
import StartGrid from './components/Grid.vue'
const StartSettings = () => import(
	/* webpackChunkName: "settings" */ './components/Settings.vue');

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
