<template>
	<transition
		name="fade-overlay" 
		:duration="{
			enter: enterDuration,
			leave: leaveDuration
	}">
		<div
			class="settings-overlay"
			v-shortkey="['esc']"
			@shortkey="closeSettings"
		>
			<div class="lightbox" @click="closeSettings"></div>
			<div class="settings">
				<nav class="settings-inner settings-nav">
					<ul class="nav-menu">
						<li
							v-for="cat in settingCategoryOrder"
							:key="cat.value"
							class="nav-item"
							:class="{active: activeCatId === cat.value}"
							@click="activeCatId = cat.value"
						>{{cat.name}}</li>
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
					</main>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import SettingsGeneral from './SettingsGeneral.vue';
import IconClose from '@/assets/icons/ui/md-close.svg';

export default {
	components: {
		SettingsGeneral,
		IconClose
	},
	data() {
		return {
			enterDuration: 500,
			leaveDuration: 250,
			activeCatId: 'general'
		}
	},
	computed: {
		activeCategoryName() {
			return this.settingCategoryOrder.find(cat => cat.value === this.activeCatId).name;
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
		}
	}
}
</script>

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
	
	min-width: 50rem;
	width: 60vw;
	max-width: 65rem;

	min-height: 25rem;
	height: 52vh;

	display: flex;
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

/* TRANSITION */

.fade-overlay-leave-to > *, .fade-overlay-enter > *, .fade-overlay-leave-to .settings-inner, .fade-overlay-enter .settings-inner {
	opacity: 0;
}

.fade-overlay-enter > .settings, .fade-overlay-leave-to > .settings {
	transform: scale(1.1);
}

/* ENTER */

.fade-overlay-enter-active > .lightbox {
	transition: 0.35s ease;
}

.fade-overlay-enter-active > .settings {
	transition: opacity 0.3s ease 0.15s, transform 0.35s ease-in-out;
}

.fade-overlay-enter-active .settings-inner {
	transition: opacity 0.2s ease .3s;
}

/* LEAVE */

.fade-overlay-leave-active > .lightbox {
	transition: 0.2s ease-out 0.05s;
	transition-property: opacity;
}

.fade-overlay-leave-active > .settings {
	transition: 0.25s ease-out;
	transition-property: opacity, transform;
}

.fade-overlay-leave-active .settings-inner {
	transition: opacity 0.15s ease-out;
}
</style>
