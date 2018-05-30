<template>
	<div class="widget-wallpaper-details">
		<div class="load-success" v-if="!usingDefaultWallpaper">
			<div class="visible">
				<p>{{location}}</p>
				<p><a :href="userLink">{{takenBy}}</a> / <a href="https://unsplash.com/?utm_source=23899&utm_medium=referral">Unsplash</a></p>
			</div>
			<div class="hoverable">
				<button @click="nextWallpaper">Next</button>
			</div>
		</div>
		<div class="load-failed" v-else>
			<button @click="retryLoadWallpapers">Retry loading wallpapers</button>
		</div>				
	</div>
</template>

<script>
export default {
	computed: {
		usingDefaultWallpaper() {
			if (this.$store.getters.failedLoadingWallpaper) return true;
			return false;
		},
		currentWallpaper() {
			return this.$store.getters.currentWallpaper;
		},
		location() {
			try {
				return this.currentWallpaper.location.title;
			}
			catch(e) {
				return "";
			}
		},
		takenBy() {
			try {
				return this.currentWallpaper.user.name;
			}
			catch(e) {
				return "";
			}
		},
		userLink() {
			try {
				return `${this.currentWallpaper.user.links.html}?utm_source=23899&utm_medium=referral`;
			}
			catch(e) {
				return "";
			}
		}
	},
	methods: {
		nextWallpaper() {
			this.$store.commit('nextWallpaper');
		},
		retryLoadWallpapers() {
			this.$store.dispatch('getWallpapersFromCollection');
		}
	}
}
</script>

<style scoped>
.widget-wallpaper-details {
	width: 100%;
	align-self: end;
}
</style>
