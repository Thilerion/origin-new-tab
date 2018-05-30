<template>
	<div class="widget-wallpaper-details">
		<div class="load-success" v-if="!usingDefaultWallpaper">
			<div class="hoverable">
				<button @click="nextWallpaper">Volgende</button>
				<p>{{location}}</p>
			</div>
			<div class="visible">
				<p><a :href="userLink">{{takenBy}}</a> / <a href="https://unsplash.com/?utm_source=23899&utm_medium=referral">Unsplash</a></p>
			</div>
		</div>
		<div class="load-failed hoverable" v-else>
			<button @click="retryLoadWallpapers">Laad achtergronden</button>
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
			return this.currentWallpaper.location;
		},
		takenBy() {
			return this.currentWallpaper.user;
		},
		userLink() {
			return `${this.currentWallpaper.urlUser}?utm_source=23899&utm_medium=referral`;
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
	opacity: 0.5;
}

.hoverable {
	opacity: 0;
	transition: opacity 0.2s ease;
}

.widget-wallpaper-details:hover .hoverable {
	opacity: 1;
}
</style>
