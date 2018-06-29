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
	/* webpackChunkName: "settings" */ './components/settings/Settings.vue');

import {mapState, mapGetters} from 'vuex';
import {changeLocale} from '@/i18n';

export default {
	name: "app",
	components: {
		StartWallpaper,
		StartGrid,
		StartSettings
	},
	computed: {
		...mapState(['showSettings']),
		...mapGetters(['fontSize', 'language'])
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
		},
		language: {
			handler(newValue, oldValue) {
				console.log("New locale: " + newValue);
				changeLocale(newValue);
			},
			immediate: true
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
