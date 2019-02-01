<template>
	<div class="settings-page">
		<div class="settings-content custom-scrollbar">
			<button class="close-btn icon-btn" @click="saveSettings">
				<SvgIcon icon="close" size="36px" />
			</button>
			<div class="settings-content-inner">
				<h1>{{ $t('components.settings') }}</h1>

				<StartSettingGroup>
					<template slot="header">{{ $t('components.general') }}</template>
					<StartSettingItem>
						<template slot="header">{{ $t('settings.name') }}</template>
						<input
							type="text"
							class="input-text"
							v-model="currentSettings.clock.username">
					</StartSettingItem>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.language') }}</template>
						<label
							v-for="lang in settingsOptions.general.language"
							:key="lang.id"
						><input
							class="input-radio"
							type="radio"
							:value="lang.id"
							v-model="currentSettings.general.language"
						>{{lang.name}}</label>
					</StartSettingItem>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.timeFormat.title') }}</template>
						<label
							v-for="format in settingsOptions.general.timeFormat"
							:key="format.value"
						><input
							class="input-radio"
							type="radio"
							:value="format.value"
							v-model="currentSettings.general.timeFormat"
						>{{ $t(`settings.timeFormat.${format.name}`) }}</label>
					</StartSettingItem>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.fontSize.title') }}</template>
						<div class="checkbox-group">
							<label><input
								type="radio"
								v-model="currentSettings.general.fontSize"
								:value="null"
								class="input-radio"
							>{{ $t('settings.fontSize.default') }}</label>
							<label><input
								type="radio"
								:checked="currentSettings.general.fontSize !== null"
								@input="$event.target.value ? currentSettings.general.fontSize = '16' : currentSettings.general.fontSize = null"
								class="input-radio"
							>{{ $t('settings.fontSize.custom') }}</label>
						</div>
						<div
							class="input-range-wrap"
						>
							<input
								type="range"
								class="slider is-circle input-range"
								:class="{'range-disabled': disableFontSizeSlider}"
								:min="settingsOptions.general.fontSize.min"
								:max="settingsOptions.general.fontSize.max"
								v-model="currentSettings.general.fontSize"
							><label
								:class="{'range-disabled': disableFontSizeSlider}"
							>{{currentSettings.general.fontSize}}px</label>
						</div>
					</StartSettingItem>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.showGreeting') }}</template>
						<input
							type="checkbox"
							v-model="currentSettings.clock.showTextGreeting"
							class="input-checkbox"
						>
					</StartSettingItem>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.showDate') }}</template>
						<input
							type="checkbox"
							v-model="currentSettings.clock.showDate"
							class="input-checkbox"
						>
					</StartSettingItem>
				</StartSettingGroup>

				<StartSettingGroup can-compress>
					<template slot="header">{{ $t('components.widgets') }}</template>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.activeWidgets') }}</template>

						<div
							class="checkbox-group"
							v-for="widget in widgetsCanBeDisabled"
							:key="widget.name"
						>
							<input
								type="checkbox"
								class="input-checkbox"
								v-model="widget.active"
							><label>{{ $t(`components.${widget.name}`) }}</label>
						</div>

					</StartSettingItem>

					<button
						@click="toggleDnd"
						class="dnd-btn setting-btn"
					>{{ $t('settings.changeWidgetDisplay') }}</button>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.presetLayouts.title')}} (beta)</template>
						<p class="preset-note">{{ $t('settings.presetLayouts.note')}}</p>
						<button class="preset-button" v-for="item in layoutOptions" :key="item" @click="changeLayout(item)">{{ $t(`settings.presetLayouts.${item}`)}}</button>
					</StartSettingItem>

				</StartSettingGroup>

				<StartSettingGroup can-compress>
					<template slot="header">{{ $t('components.weather') }}</template>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.useCustomLocation.title') }}</template>

						<div class="checkbox-group checkbox-group-optional-text input-text-height">
							<input
								type="checkbox"
								class="input-checkbox"
								v-model="currentSettings.weather.useCustomLocation"
							><label v-if="currentSettings.weather.useCustomLocation"
							>{{ $t('settings.useCustomLocation.enabled') }}<input
								type="text"
								class="input-text"
								v-model="currentSettings.weather.customLocationQuery"
							></label>
							<label v-else>{{ $t('settings.useCustomLocation.disabled') }}</label>
						</div>

					</StartSettingItem>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.units.title') }}</template>
						<label
							v-for="unit in settingsOptions.weather.units"
							:key="unit.value"
						><input
							class="input-radio"
							type="radio"
							:value="unit.value"
							v-model="currentSettings.weather.units"
						>{{ $t(`settings.units.${unit.name.toLowerCase()}`) }}</label>
					</StartSettingItem>
					
				</StartSettingGroup>

				<StartSettingGroup can-compress>
					<template slot="header">{{ $t('components.wallpaper') }}</template>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.wallpaperCollection') }}</template>
						<div class="input-select">
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
					</StartSettingItem>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.newWallpaper.title') }}</template>
						<div class="input-select">
							<select
								v-model="currentSettings.wallpaper.wallpaperRefresh"
							>
								<option
									v-for="opt in settingsOptions.wallpaper.wallpaperRefresh"
									:key="opt.value"
									:value="opt.value"
								>{{ $t(`settings.newWallpaper.${opt.id}`)}}</option>
							</select>	
						</div>
					</StartSettingItem>
					
				</StartSettingGroup>

				<StartSettingGroup can-compress>
					<template slot="header">{{ $t('components.quote') }}</template>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.quoteCategory.title') }}</template>

						<div class="input-select">
							<select
								v-model="currentSettings.quote.category"
								class="text-capitalize"
							>
								<option
									v-for="cat in settingsOptions.quote.quoteCategory"
									:key="cat"
									:value="cat"
								>{{ $t(`settings.quoteCategory.${cat}`) }}</option>
							</select>
						</div>

					</StartSettingItem>
					
				</StartSettingGroup>

				<StartSettingGroup can-compress>
					<template slot="header">{{ $t('components.news') }}</template>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.newsInterval') }}</template>
						<div class="input-range-wrap">
							<input
								type="range"
								class="slider is-circle input-range"
								:min="settingsOptions.news.slideInterval.min"
								:max="settingsOptions.news.slideInterval.max"
								step="1000"
								v-model="currentSettings.news.slideInterval"
							><label>{{currentSettings.news.slideInterval / 1000}}s</label>
						</div>

					</StartSettingItem>
					
				</StartSettingGroup>

				<StartSettingGroup can-compress>
					<template slot="header">{{ $t('components.topSites') }}</template>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.topSitesAmount') }}</template>
						<div class="input-range-wrap">
							<input
								type="range"
								class="slider is-circle input-range"
								:min="settingsOptions.topSites.maxTopSites.min"
								:max="settingsOptions.topSites.maxTopSites.max"
								v-model="currentSettings.topSites.maxTopSites"
								@mousedown="showTopPagePreview = true"
								@mouseup="showTopPagePreview = false"
							><label>{{currentSettings.topSites.maxTopSites}}</label>
						</div>
					</StartSettingItem>

					<StartSettingItem>
						<template slot="header">{{ $t('settings.topSitesColumns') }}</template>
						<div class="input-range-wrap">
							<input
								type="range"
								class="slider is-circle input-range"
								:min="settingsOptions.topSites.columns.min"
								:max="settingsOptions.topSites.columns.max"
								v-model="currentSettings.topSites.columns"
								@mousedown="showTopPagePreview = true"
								@mouseup="showTopPagePreview = false"
							><label>{{currentSettings.topSites.columns}}</label>
						</div>
					</StartSettingItem>

					<transition name="fade-preview">
						<div 
							class="toppages-preview"
							v-if="showTopPagePreview">
							<div
								class="toppages-preview-row"
								v-for="(row, index) in previewArray"
								:key="index">
								<div
									class="toppages-preview-item"
									v-for="(item, index2) in row"
									:key="index2"></div>
							</div>
						</div>
					</transition>
					
				</StartSettingGroup>

				<button @click="resetAllStorage" class="reset-btn setting-btn">{{ $t('settings.resetSettings') }}</button>
			</div>
			
			<button @click="saveSettings" class="save-btn setting-btn">{{ $t('settings.save') }}</button>
		</div>
	</div>
</template>

<script>
import {settingsOptions} from '@/store/libs/defaultUserSettings';
import {mapMutations, mapActions} from 'vuex';
import {layoutOptions} from '@/store/libs/presetLayouts';

import StartSettingGroup from './SettingGroup.vue'
import StartSettingItem from './SettingItem.vue'

export default {
	components: {
		StartSettingGroup,
		StartSettingItem
	},
	data() {
		return {
			currentSettings: {
				general: {},
				widgets: [],
				weather: {},
				wallpaper: {},
				quote: {},
				news: {},
				topSites: {},
				calendar: {}
			},
			initialSettings: {
				general: {},
				widgets: [],
				weather: {},
				wallpaper: {},
				quote: {},
				news: {},
				topSites: {},
				calendar: {}
			},
			settingsOptions: {...settingsOptions},
			layoutOptions,

			showTopPagePreview: false
		}
	},
	computed: {
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
		},
		previewRows() {
			return Math.ceil(this.currentSettings.topSites.maxTopSites / this.currentSettings.topSites.columns);
		},
		previewCols() {
			return this.currentSettings.topSites.columns * 1;
		},
		previewArray() {
			let arr = [];
			for (let i = 1; i <= this.currentSettings.topSites.maxTopSites; i++) {
				let curRow = Math.ceil(i / this.previewCols) -1;
				console.log(i, this.previewCols, curRow);
				if (arr[curRow]) {
					arr[curRow].push([]);
				} else {
					arr.push([[]]);
				}
			}
			return arr;
		},
		language() {
			return this.currentSettings.general.language;
		}
	},
	methods: {
		...mapMutations(['setShowSettings']),
		...mapActions(['saveUpdatedSettings']),
		saveSettings() {
			if (this.deepEquals(this.currentSettings, this.initialSettings)) {
				console.log("No changes in settings.");
			} else {
				console.log("Settings have changed");
				this.saveUpdatedSettings(this.currentSettings);
			}			
			this.setShowSettings(false);
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
			this.$store.commit('grid/toggleDnd');
			this.saveSettings();
		},

		keyUpEvent(e) {
			if (e.key === "Enter") {
				this.saveSettings();
			} else if (e.target !== document.body) {
				return;
			} else if (e.key === "Escape") {
				this.saveSettings();
			};
		},

		createShortcuts() {
			document.addEventListener('keyup', this.keyUpEvent);
		},
		removeShortcuts() {
			document.removeEventListener('keyup', this.keyUpEvent);
		},
		changeLayout(item) {
			this.$store.dispatch('activeWidgets/usePresetLayout', item);
			this.saveSettings();
		}
	},
	created() {
		let currentSettings = this.$store.getters.settingsToWatch;
		this.currentSettings = {...this.deepClone(currentSettings)};
		this.initialSettings = {...this.deepClone(currentSettings)};
		this.createShortcuts();
	},
	beforeDestroy() {
		this.initialSettings = {};
		this.removeShortcuts();
	},
	mounted() {
		console.log(this.deepClone(this.currentSettings.widgets));
	},
	watch: {
		language(newValue, oldValue) {
			this.$store.commit('setLanguage', newValue);
		}
	}
}
</script>

<style scoped>
.settings-page {
	font-size: 0.875rem;
	position: fixed;
	top: 0; bottom: 0;
	left: 0; right: 0;
	background-color: rgba(10, 10, 10, 0.95);
}

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


.settings-content {
	height: 100%;
	position: relative;
	padding: 2rem 0 0 1rem;
}

.settings-content-inner {
	width: 70%;
	max-width: 900px;
	min-width: 700px;
	margin: auto;
	position: relative;
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

.input-select, .input-text, .input-range-wrap, .checkbox-group-optional-text {
	width: 100%;
	max-width: 500px!important;
}

.input-range-wrap {
	display: flex;
}

.input-range-wrap > label {
	flex: 0 0 2rem;
	text-align: right;
}

.input-range-wrap > .input-range {
	flex: 1 1 auto;
}

.checkbox-group-optional-text {
	display: flex;
	align-items: center;
}

.checkbox-group-optional-text .input-checkbox {
	flex: 0 0 auto;
}

.checkbox-group-optional-text > label {
	flex: 1 1 90%;
	display: flex;
	align-items: center;
}

.checkbox-group-optional-text > label > .input-text {
	margin-left: 0.5rem;
}

.setting-btn {
	display: block;	
	border-radius: 4px;
	border: 2px solid white;;
	background: white;
	transition: all .2s ease;
	margin-bottom: 1rem;
	padding: 0.5rem;
}

.setting-btn:hover {
	background: black;
	color: white;
}

.save-btn {
	margin: auto;
	margin-top: 2rem;
	margin-bottom: 3rem;
	min-width: 8rem;
	min-height: 3rem;
}

.slider.range-disabled {
	opacity: 0.4;
}

label.range-disabled {
	opacity: 0;
}

label {
	display: inline-flex;
	align-items: center;
}

.toppages-preview {
	margin-bottom: -2px;
	display: inline-block;
	position: absolute;
	right: -2em;
	top: 0;
}

.toppages-preview-row {
	display: flex;
	opacity: 0.5;
	margin-left: -2px;
	margin-bottom: 2px;
	justify-content: center;
}

.toppages-preview-item {
	background: white;
	width: 6px;
	height: 6px;
	margin-left: 2px;
}

.fade-preview-leave-active {
	transition: opacity .5s ease 1s;
}

.fade-preview-enter-active {
	transition: opacity .2s ease;
}

.fade-preview-enter, .fade-preview-leave-to {
	opacity: 0;
}

.reset-btn {
	background: none;
	color: white;
	border-color: transparent;
	margin: 0;
	font-size: 10px;
	padding: 0;
	position: absolute;
	bottom: -8em;
	left: 0;
	opacity: 0.2;
}

.preset-note {
	margin-bottom: 0.25em;
}

.preset-button {
	margin: 0.25em 0 0 0.75em;
	border-radius: 4px;
	border: 2px solid white;;
	background: white;
	transition: all .2s ease;
	padding: 0.5rem;
}

.preset-button:first-of-type {
	margin-left: 0;
}

.preset-button:hover {
	background: black;
	color: white;
}

</style>
