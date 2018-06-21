<template>
	<div class="settings-page">
		<div class="settings-content">
			<button class="close-btn icon-btn" @click="closeSettings">
				<StartSvgIcon icon="close" size="36px" />
			</button>
			<div class="settings-content-inner">
				<h1>Instellingen</h1>

				<div class="setting-group">
					<h2>Algemeen</h2>
					<div class="setting-group-content">

						<div class="setting-item">
							<h3 class="setting-item-name">Naam</h3>				
							<input type="text" v-model="currentSettings.general.username">
						</div>

						<div class="setting-item">
							<h3 class="setting-item-name">Taal</h3>
							<label v-for="lang in settingsOptions.general.language" :key="lang.id"><input type="radio" :value="lang.id" v-model="currentSettings.general.language">{{lang.name}}</label>
						</div>

						<div class="setting-item">
							<h3 class="setting-item-name">Textgrootte</h3>
							<div class="checkbox-group">
								<input type="radio" v-model="currentSettings.general.fontSize"><label>Standaard</label>
							</div>				
							<input type="range" class="slider is-circle" :class="{'range-disabled': disableFontSizeSlider}" :min="settingsOptions.general.fontSize.min" :max="settingsOptions.general.fontSize.max" v-model="currentSettings.general.fontSize"><label :class="{'hide-label': !!disableFontSizeSlider}">{{currentSettings.general.fontSize}}px</label>
						</div>

						<div class="setting-item">
							<h3 class="setting-item-name">Laat welkomsttekst zien</h3>
							<input type="checkbox" v-model="currentSettings.general.showTextGreeting">
						</div>

					</div>
				</div>

				<div class="setting-group">
					<h2>Widgets</h2>
					<div class="setting-group-content">
						<div class="setting-item">
							<h3 class="setting-item-name">Actieve widgets</h3>
							<div class="checkbox-group" v-for="widget in widgetsCanBeDisabled" :key="widget.name">
								<input type="checkbox" v-model="widget.active"><label class="text-capitalize">{{widget.name}}</label>
							</div>
						</div>
					</div>
				</div>

				<div class="setting-group">
					<h2>Weer</h2>
					<div class="setting-group-content">
						<div class="setting-item">
							<h3 class="setting-item-name">Gebruik aangepaste locatie</h3>
							<div class="checkbox-group">
								<input type="checkbox" v-model="currentSettings.weather.useCustomLocation">
								<label v-if="currentSettings.weather.useCustomLocation">Ja: <input
									type="text"
									v-model="currentSettings.weather.customLocationToUse"
								></label>
								<label v-else>Nee, gebruik browser locatie.</label>
							</div>
						</div>
					</div>
				</div>

				<div class="setting-group">
					<h2>Achtergrond</h2>
					<div class="setting-group-content">
						<div class="setting-item">
							<h3 class="setting-item-name">Achtergrond collectie</h3>
							<div class="select">
								<select
									v-model="currentSettings.wallpaper.wallpaperCollection"
								>
									<option
										v-for="col in settingsOptions.wallpaper.wallpaperCollection"
										:key="col.id"
										:value="col.id"
									>{{col.name}}</option>
								</select>	
							</div>			
						</div>

						<div class="setting-item">
							<h3 class="setting-item-name">Nieuwe achtergrond</h3>
							<div class="select">
								<select
									v-model="currentSettings.wallpaper.wallpaperRefresh"
								>
									<option
										v-for="opt in settingsOptions.wallpaper.wallpaperRefresh"
										:key="opt.value"
										:value="opt.value"
									>{{opt.name}}</option>
								</select>	
							</div>			
						</div>
					</div>
				</div>

				<div class="setting-group">
					<h2>Quote</h2>
					<div class="setting-group-content">
						<div class="setting-item">
							<h3 class="setting-item-name">Quote categorie</h3>
							<div class="select">
								<select
									v-model="currentSettings.quote.category"
									class="text-capitalize"
								>
									<option
										v-for="cat in settingsOptions.quote.quoteCategory"
										:key="cat"
										:value="cat"
									>{{cat}}</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				<div class="setting-group">
					<h2>Nieuws</h2>
					<div class="setting-group-content">
						<div class="setting-item">
							<h3 class="setting-item-name">Nieuws slide snelheid</h3>
							<input
								type="range"
								class="slider is-circle"
								:min="settingsOptions.news.slideInterval.min"
								:max="settingsOptions.news.slideInterval.max"
								step="1000"
								v-model="currentSettings.news.slideInterval"
							><label>{{currentSettings.news.slideInterval / 1000}}s</label>
						</div>
					</div>
				</div>

			</div>
			<button @click="saveSettings" class="save-btn">Opslaan</button>
		</div>
	</div>
</template>

<script>
import {settingsOptions} from '../store/defaultUserSettings';

export default {
	data() {
		return {
			currentSettings: {
				general: {},
				widgets: [],
				weather: {},
				wallpaper: {},
				quote: {},
				news: {},
				calendar: {}
			},
			initialSettings: {
				general: {},
				widgets: [],
				weather: {},
				wallpaper: {},
				quote: {},
				news: {},
				calendar: {}
			},
			settingsOptions: {...settingsOptions}
		}
	},
	computed: {
		currentLocation() {
			//TODO: field for new custom location
			return this.$store.getters.locationToUse;
		},
		disableFontSizeSlider() {
			const isDefault = this.currentSettings.general.fontSize === null;
			return isDefault;
		},
		widgetsCanBeDisabled() {
			const widgetOptions = settingsOptions.widgets.widgetOptions;
			let cur = [...this.currentSettings.widgets];

			return cur.filter(w => {
				return widgetOptions[w.name].disable;
			});
		}
	},
	methods: {
		closeSettings() {
			this.$store.commit('setShowSettings', false);
		},
		saveSettings() {
			if (this.deepEquals(this.currentSettings, this.initialSettings)) {
				console.log("No changes in settings.");
			} else {
				console.log("Settings have changed");
				this.$store.dispatch('saveUpdatedSettings', this.currentSettings);
			}			
			this.closeSettings();
		},
		deepClone(obj) {
			return JSON.parse(JSON.stringify(obj));
		},
		deepEquals(a, b) {
			return JSON.stringify(a) === JSON.stringify(b);
		},
		resetAllStorage() {
			let areYouSure = confirm("Weet je het zeker? Alles wordt verwijderd en moet opnieuw geladen en ingesteld worden. Alleen gebruiken als er iets niet goed werkt!");
			if (!areYouSure) return;
			this.$store.resetAllStorage();
			location.reload();
		},
		toggleDnd() {
			this.$store.commit('toggleDnd');
			this.saveSettings();
		}
	},
	created() {
		let currentSettings = this.$store.getters.settingsWatch;
		this.currentSettings = {...this.deepClone(currentSettings)};
		this.initialSettings = {...this.deepClone(currentSettings)};
	},
	beforeDestroy() {
		this.initialSettings = {};
	}
}
</script>

<style scoped>
.text-capitalize {
	text-transform: capitalize;
}

label:not(:last-of-type) {
	margin-right: 1rem;
}

input + label {
	margin-left: 0.25rem;
}

label > input {
	margin-right: 0.25rem;
}

.checkbox-group {
	margin-bottom: 0.25rem;
}

.setting-item {
	margin-bottom: 1rem;
}

.setting-item-name {
	margin-bottom: 0.25rem;
}

.settings-page {
	font-size: 1rem;
	position: fixed;
	top: 0; bottom: 0;
	left: 0; right: 0;
	background-color: rgba(10, 10, 10, 0.9);
}

.settings-content {
	height: 100%;
	overflow-y: scroll;
	position: relative;
	padding: 2rem 0 0 1rem;
}

.settings-content-inner {
	width: 80%;
	max-width: 1000px;
	min-width: 700px;
	margin: auto;
}

.close-btn {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
}

h1 {
	font-size: 2.5rem;
	margin-bottom: 2rem;
}

h2 {
	font-size: 1.25rem;
	font-weight: normal;
	text-transform: capitalize;
}

.setting-group {
	display: flex;
	border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}

.setting-group:not(:last-of-type) {
	margin-bottom: 0.7rem;
}

.setting-group > h2 {
	flex: 0 0 15rem;
}

.setting-group-content {
	flex: 1 1 auto;
}
</style>
