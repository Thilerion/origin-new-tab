<template>
	<div class="widget-unsplash-details">

		<div class="controls">
			<button @click="goToNextWallpaper">Next</button>
			<a :href="downloadUrl"
				:target="downloadUrl ? '_blank' : undefined"
				rel="noopener"
			>DL</a>
			<button @click="hideWallpaper">X</button>
		</div>

		<div class="user-info">
			<a href="" class="user-link user-name">Michael van Meerwijk</a>
			<a href="" class="user-link user-location">Rotterdam, Nederland</a>
		</div>

	</div>
</template>

<script>
export default {
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
	padding-top: 0.5em;
}

.user-link {
	text-decoration: none;
	opacity: 0.7;
	transition: opacity 0.15s ease;
	line-height: 1.3;
}

.user-link:hover {
	opacity: 1;
}

.user-name {
	letter-spacing: 0.2px;
	font-size: 0.875em;
}

.user-location {
	font-size: 0.667em;
	padding-top: 2px;
	letter-spacing: 0.3px;
}
</style>
