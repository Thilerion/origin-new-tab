<template>
	<div class="widget-unsplash-details shadow-80">

		<div class="controls">
			<button			
				@click="goToNextWallpaper"
				class="icon-btn"
			><IconSync class="icon"/></button>

			<a :href="downloadUrl"
				:target="downloadUrl ? '_blank' : undefined"
				rel="noopener"
				class="icon-btn"
			><IconDownload class="icon"/></a>

			<button
				@click="hideWallpaper"
				class="icon-btn"
			><IconClose class="icon"/></button>
		</div>

		<div class="user-info enable-select">
			<a v-if="userName" :href="urlUser" class="user-link user-name">Photo by {{userName}}</a>
			<p v-if="photoLocation" class="user-link user-location">{{photoLocation}}</p>
		</div>

	</div>
</template>

<script>
import IconSync from '@/assets/icons/ui/md-sync.svg';
import IconDownload from '@/assets/icons/ui/md-download.svg';
import IconClose from '@/assets/icons/ui/md-close.svg';

import _get from 'lodash.get';

export default {
	components: {
		IconSync,
		IconDownload,
		IconClose
	},
	computed: {
		currentWallpaper() {
			return this.$store.getters['unsplash/currentWallpaper'];
		},
		downloadUrl() {
			try {
				if (this.currentWallpaper.urlDownload) {
					return `${this.currentWallpaper.urlDownload}?utm_source=23899&utm_medium=referral&force=true`;
				} else {
					return `${this.currentWallpaper.url}?utm_source=23899&utm_medium=referral&force=true`;
				}
			} catch(e) {
				console.error("Could not enable the download url.", e);
				return "";
			}
		},
		urlUser() {
			return _get(this.currentWallpaper, 'urlUser', '');
		},
		userName() {
			return _get(this.currentWallpaper, 'user', '');
		},
		photoLocation() {
			return _get(this.currentWallpaper, 'location', '');
		}
	},
	methods: {
		goToNextWallpaper() {
			this.$store.dispatch('unsplash/goToNextWallpaper');
		},
		hideWallpaper() {
			this.$store.dispatch('unsplash/hideCurrentWallpaper');
		}
	}
}
</script>

<style scoped>
.user-info {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding-top: 0.25em;
}

.user-link {
	text-decoration: none;
	line-height: 1.3;
}

.user-name:hover {
	opacity: 1;
}

.user-name {
	letter-spacing: 0.2px;
	font-size: 0.875em;
	opacity: 0.85;
	transition: opacity 0.15s ease;
}

.user-location {
	opacity: 0.7;
	font-size: 0.667em;
	padding-top: 2px;
	letter-spacing: 0.3px;
}

.controls {
	transform: translateY(0.75em);
	opacity: 0;
	transition: all .3s ease;
	transition-property: opacity, transform;
	display: flex;
}

.icon-btn {
	border-radius: 50%;
	width: 24px;
	height: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: background .15s;
}

.icon-btn:not(:last-child) {
	margin-right: 2px;
}

.icon-btn:hover {
	background: rgba(255, 255, 255, 0.3);
}

.widget-unsplash-details:hover .controls {
	opacity: 1;
	transform: translateY(0);
}

.icon {
	width: 18px;
	height: 18px;
	color: inherit;
	fill: currentColor;
}
</style>
