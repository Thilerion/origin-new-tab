<template>
	<div class="widget-wallpaper-details">
		<div class="visible">
			<p>{{location}}</p>
			<p v-if="!!currentWallpaper"><a :href="userLink">{{takenBy}}</a> / <a href="https://unsplash.com/?utm_source=23899&utm_medium=referral">Unsplash</a></p>
		</div>
		<div class="hoverable">
			<button @click="nextWallpaper">Next</button>
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
			if (this.currentWallpaper && this.currentWallpaper.location) {
				return this.currentWallpaper.location.title;
			}
			return "";
		},
		takenBy() {
			return this.currentWallpaper.user.name;
		},
		userLink() {
			return `${this.currentWallpaper.user.links.html}?utm_source=23899&utm_medium=referral`;
		}
	},
	methods: {
		nextWallpaper() {
			this.$store.commit('nextWallpaper');
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
