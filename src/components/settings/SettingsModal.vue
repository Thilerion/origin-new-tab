<template>
	<transition
		name="fade-overlay" 
		:duration="{
			enter: enterDuration,
			leave: leaveDuration
	}">
		<div
			class="settings-overlay"
		>
			<div class="lightbox" @click="closeSettings"></div>
			<div class="settings"
				v-focus="true"
				v-shortkey="['esc']"
				@shortkey="closeSettings"
			>
				<nav class="settings-inner settings-nav">
					<ul class="nav-menu">
						<li
							v-for="cat in settingCategoryOrder"
							:key="cat.value"
							class="nav-item"
							:class="{active: activeCatId === cat.value}"
							@click="activeCatId = cat.value"
						>{{getLocaleCatName(cat)}}</li>
					</ul>
				</nav>
				<div class="settings-inner settings-content">
					<header class="settings-header">
						<h1 class="settings-title">{{activeCategoryName}}</h1>
						<button
							@click="closeSettings"
							class="icon-btn settings-close-btn"
						><IconClose class="icon"/></button>
					</header>
					<main class="settings-main">
						<SettingsGeneral
							v-if="activeCatId === 'general'"
							:settingOptions="settingsOptions.general"
						/>
						<SettingsDashboard
							v-else-if="activeCatId === 'dashboard'"
							:settingOptions="settingsOptions.dashboard"
						/>
						<component 
							v-else-if="settingsComponents[activeCatId]"
							:is="settingsComponents[activeCatId]"
							:settingOptions="settingsOptions[activeCatId]"
						/>
					</main>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import SettingsGeneral from './SettingsGeneral.vue';
import SettingsDashboard from './SettingsDashboard.vue';
import IconClose from '@/assets/icons/ui/md-close.svg';

import { settingsComponents } from '@/widgets';

export default {
	components: {
		SettingsGeneral,
		SettingsDashboard,
		IconClose
	},
	data() {
		return {
			enterDuration: 350,
			leaveDuration: 250,
			activeCatId: 'general',
			
			settingsComponents: {
				general: SettingsGeneral,
				dashboard: SettingsDashboard,
				...settingsComponents
			}
		}
	},
	computed: {
		activeCategoryName() {
			const cat = this.settingCategoryOrder.find(cat => cat.value === this.activeCatId);
			if (cat.localePath) return this.$t(cat.localePath);
			return cat.name;
		},
		settingsOptions() {
			return this.$store.getters.settingsOptions;
		},
		settingCategoryOrder() {
			return this.$store.getters.settingCategoryOrder.filter(val => {
				return Object.keys(this.settingsOptions).includes(val.value);
			});
		}
	},
	methods: {
		closeSettings() {
			this.$store.commit('setShowSettingsOverlay', false);
		},
		getLocaleCatName(cat) {
			if (cat.localePath) return this.$t(cat.localePath);
			return cat.name;
		} 
	},
	mounted() {
		const el = this.$el;
		el.style.setProperty('--enter-dur', `${this.enterDuration}ms`);
		el.style.setProperty('--leave-dur', `${this.leaveDuration}ms`);
	}
}
</script>

<style>
.settings-overlay {
	--enter-dur: 2500ms;
	--leave-dur: 2500ms;

	--enter-dur2: calc(0.2 * var(--enter-dur));
	--enter-dur3: calc(0.3 * var(--enter-dur));
	--enter-dur4: calc(0.4 * var(--enter-dur));
	--enter-dur6: calc(0.6 * var(--enter-dur));
	--enter-dur7: calc(0.7 * var(--enter-dur));

	--leave-dur2: calc(0.2 * var(--leave-dur));
	--leave-dur6: calc(0.6 * var(--leave-dur));
	--leave-dur8: calc(0.8 * var(--leave-dur));
}
</style>


<style scoped>
.settings-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
}

.lightbox {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
}

.settings {
	border-radius: 3px;
	overflow: hidden;
	position: relative;
	background: #f7f7f7;
	color: #333;
	
	width: 45rem;

	min-height: 20rem;
	height: 35vh;
	max-height: 27rem;

	display: flex;
}

.settings:focus {
	outline: none;
}

.settings-inner {
	overflow: auto;
}

.settings-nav {
	background: hsl(0, 0%, 94%);
	border-right: 1px solid rgba(0, 0, 0, 0.1);
	min-width: 12.5rem;
	max-width: 17rem;
	flex: 1 2 25%;
	font-size: 1rem;
}

.nav-menu {
	list-style: none;
	padding-top: 1rem;
}

.nav-item {
	cursor: pointer;
	padding: 0.5rem 0.75rem 0.5rem 1.25rem;
	line-height: 1.5rem;
	font-weight: 600;
	opacity: 0.65;
	transition: .15s ease;
	transition-property: opacity, background;
}

.nav-item:hover, .nav-item.active {
	background: rgba(0, 0, 0, 0.05);
	opacity: 1;
}

.settings-content {
	flex: 5 1 75%;
}

.settings-header {
	display: flex;
	align-items: flex-start;
	padding: 0.75rem;
	padding-left: 1.5rem;
}

.settings-title {
	flex: 1;
	font-size: 1.5rem;
	padding-top: 0.75rem;
}

.settings-close-btn {
	width: 32px;
	height: 32px;
	flex: 0 0 32px;
}
.settings-close-btn:hover {
	background: rgba(0, 0, 0, 0.05);
}

.settings-main {
	padding: 0.75rem 1.5rem;
}

/* GLOBAL SETTINGS STYLING */
.settings >>> .form-item {
	margin-bottom: 1rem;
}

.settings >>> .form-label {
	margin-bottom: 0.25rem;
}

/* TRANSITION */

.fade-overlay-leave-to > *, .fade-overlay-enter > *, .fade-overlay-leave-to .settings-inner, .fade-overlay-enter .settings-inner {
	opacity: 0;
}

.fade-overlay-enter > .settings {
	transform: scale(1.05);
}

.fade-overlay-leave-to > .settings {
	transform: scale(1.1);
}

/* ENTER */

.fade-overlay-enter-active > .lightbox {
	transition: var(--enter-dur7) ease;
}

.fade-overlay-enter-active > .settings {
	transition: opacity var(--enter-dur6) ease var(--enter-dur3), transform var(--enter-dur7) ease-in-out;
}

.fade-overlay-enter-active .settings-inner {
	transition: opacity var(--enter-dur2) ease var(--enter-dur6);
}

/* LEAVE */

.fade-overlay-leave-active > .lightbox {
	transition: var(--leave-dur8) ease-out var(--leave-dur2);
	transition-property: opacity;
}

.fade-overlay-leave-active > .settings {
	transition: var(--leave-dur) ease-out;
	transition-property: opacity, transform;
}

.fade-overlay-leave-active .settings-inner {
	transition: opacity var(--leave-dur6) ease-out;
}
</style>
