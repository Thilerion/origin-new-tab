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
				<input v-model="currentSettings.name" type="text" class="input">
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
					<!-- no value on this input to bind it to 'null' -->
					<input type="radio" v-model="currentSettings.fontSize">
					<span class="setting-input-label">Standaard</span>
				</div>
				<div class="setting-input font-size-range">
					<input type="range" class="slider is-circle" :class="{'range-disabled': disableFontSizeSlider}" :min="settingsOptions.user.fontSize.min" :max="settingsOptions.user.fontSize.max" v-model="currentSettings.fontSize">
					<div :class="{'hide-label': !!disableFontSizeSlider}" class="setting-input-label">{{currentSettings.fontSize}}px</div>
				</div>
				
			</div>
			<div class="setting-wrap">
				<label class="f-weight-heavy">Achtergrond collectie</label>
				<div class="select">
				<select v-model="currentSettings.wallpaperCollection">
					<option v-for="col in settingsOptions.wallpaper.wallpaperCollection" :key="col.id" :value="col.id">{{col.name}}</option>
				</select>
				</div>
			</div>
			<div class="setting-wrap">
				<label class="f-weight-heavy">Quote categorie</label>
				<div class="select">
				<select v-model="currentSettings.quoteCategory" class="quote-option">
					<option v-for="cat in settingsOptions.quote.quoteCategory" :key="cat" :value="cat" class="quote-option">{{cat}}</option>
				</select>
				</div>				
			</div>
			<button @click="saveSettings" class="save-btn">Opslaan</button>
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
		},
		disableFontSizeSlider() {
			const isDefault = this.currentSettings.fontSize === null;
			console.log(this.currentSettings.fontSize, isDefault);
			return isDefault;
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
				};
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
	
}

.setting-input:not(:last-of-type) {
	margin-bottom: 0.25rem;
}

.setting-radio {
	display: flex;
	align-items: center;
	margin-bottom: 0.25rem;
}

.setting-radio-label {
	margin-left: 0.25rem;
}

input[type="range"].slider {
	flex: 1 1 100%;
}

input[type="range"].slider.range-disabled {
	opacity: 0.5;
}

.setting-input.font-size-range {
	display: flex;
	align-items: center;
	width: 100%;
}

.font-size-range .setting-input-label {
	flex: 0 0 3rem;
	text-align: right;
}

.font-size-range .setting-input-label.hide-label {
	opacity: 0;
}

.quote-option {
	text-transform: capitalize;
}

.save-btn {
	display: block;
	padding: 0.5rem 0.75rem;
	border-radius: 4px;
	margin: 2rem auto 0;
}
</style>
