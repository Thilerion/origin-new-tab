<template>
	<div class="settings-page">
		<button class="close-btn icon-btn" @click="closeSettings">
			<StartSvgIcon icon="close" size="36px" />
		</button>
		<header class="settings-header f-align-c">
			<h2 class="f-weight-light">Instellingen</h2>
		</header>
		<main class="settings-content">
			<div class="setting-wrap">
				<label class="f-weight-heavy">Naam</label>
				<input v-model="currentSettings.name" type="text">
			</div>
			<div class="setting-wrap">
				<label class="f-weight-heavy">Taal</label>
				<div class="setting-radio" v-for="lang in settingsOptions.user.language" :key="lang.id">
					<input type="radio" :value="lang.id" v-model="currentSettings.language">
					<span class="setting-radio-label">{{lang.name}}</span>
				</div>				
			</div>
			<div class="setting-wrap">
				<label class="f-weight-heavy">Text grootte</label>
				<div class="setting-input">
					<input type="range" :min="settingsOptions.user.fontSize.min" :max="settingsOptions.user.fontSize.max" v-model="currentSettings.fontSize">
					<span class="setting-input-label">{{currentSettings.fontSize}}px</span>
				</div>
				
			</div>
			<div class="setting-wrap">
				<label class="f-weight-heavy">Achtergrond collectie</label>
				<input v-model="currentSettings.wallpaperCollection" type="text">
			</div>
			<div class="setting-wrap">
				<label class="f-weight-heavy">Quote categorie</label>
				<input v-model="currentSettings.quoteCategory" type="text">
			</div>
			<button @click="saveSettings">Opslaan</button>
		</main>
	</div>
</template>

<script>
import {settingsOptions} from '../store/defaultUserSettings';

export default {
	data() {
		return {
			currentSettings: {
				name: "",
				language: "",
				fontSize: "",
				wallpaperCollection: "",
				quoteCategory: ""
			},
			initialSettings: {
				name: "",
				language: "",
				fontSize: "",
				wallpaperCollection: "",
				quoteCategory: ""
			},
			settingsOptions: {...settingsOptions}
		}
	},
	computed: {
		showSettings() {
			return this.$store.getters.showSettings;
		}
	},
	methods: {
		closeSettings() {
			this.$store.commit('toggleSettings', false);
		},
		saveSettings() {
			let settingsToSave = {};
			for (let setting in this.currentSettings) {
				console.log(this.currentSettings[setting], this.initialSettings[setting], this.currentSettings[setting] !== this.initialSettings[setting]);
				if (this.currentSettings[setting] !== this.initialSettings[setting]) {
					settingsToSave[setting] = this.currentSettings[setting];
				}
			}
			this.$store.dispatch('saveSettings', settingsToSave);
			this.closeSettings();
		}
	},
	created() {
		let currentSettings = this.$store.getters.currentSettings;
		this.currentSettings = {...currentSettings};
		this.initialSettings = {...currentSettings};
		console.log(this.currentSettings);
	},
	beforeDestroy() {
		this.initialSettings = {};
		console.log("Destroying");
	}
}
</script>

<style scoped>
.settings-page {
	position: fixed;
	width: 100vw;
	height: 100vh;
	top: 0; left: 0;
	background-color: rgba(0, 0, 0, 0.9);
	padding: 1rem;
	display: flex;
	flex-direction: column;
}

.close-btn {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
}

.settings-header {
	font-size: 2rem;
	margin-bottom: 1rem;
	flex: 0 0 auto;
}

.settings-content {
	/* border: 1px solid red; */
	width: 90%;
	max-width: 700px;
	margin: 0 auto;
	flex: 1 1 auto;
}

.setting-wrap {
	display: flex;
	flex-direction: column;
	max-width: 300px;
}

.setting-wrap:not(:last-of-type) {
	margin-bottom: 1rem;
}

.setting-wrap > label {
	margin-bottom: 0.25rem;
}

.setting-wrap > input {
	border: none;
	border-radius: 2px;
	padding: 0.25em 0.25em;
}

.setting-radio {
	display: flex;
	align-items: center;
	margin-bottom: 0.25rem;
}

.setting-radio-label {
	margin-left: 0.25rem;
}
</style>
