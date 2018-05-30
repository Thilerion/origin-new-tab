<template>
	<div class="widget-wallpaper-details f-shadow-heavy" v-if="wallpaperInitialized">
		<div class="row-bottom">
			<button class="load-btn" @click="nextWallpaper" v-if="!usingDefaultWallpaper">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
   					<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    				<path d="M0 0h24v24H0z" fill="none"/>
				</svg>
			</button>

			<p
				v-if="currentWallpaper.user"
				class="attribution f-shadow-heavy"
			>Photo by <a :href="userUrl" target="_blank">{{currentWallpaper.user}}</a> on <a :href="unsplashUrl" target="_blank">Unsplash</a></p>
			<p
				v-else
				class="attribution"
			>Photo from <a :href="unsplashUrl" target="_blank">Unsplash</a></p>
		</div>		

		<p
			v-if="currentWallpaper.location"
			class="location"
		>{{currentWallpaper.location}}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			unsplashBaseUrl: "https://unsplash.com/",
			unsplashReferralSuffix: "?utm_source=23899&utm_medium=referral"
		}
	},
	computed: {
		usingDefaultWallpaper() {
			if (this.$store.getters.failedLoadingWallpaper) return true;
			return false;
		},
		currentWallpaper() {
			return this.$store.getters.currentWallpaper;
		},
		userUrl() {
			try {
				return `${this.currentWallpaper.urlUser}?utm_source=23899&utm_medium=referral`;
			}
			catch(e) {
				return "";
			}			
		},
		unsplashUrl() {
			return `${this.unsplashBaseUrl}${this.unsplashReferralSuffix}`;
		},
		wallpaperInitialized() {
			return this.$store.getters.wallpaperInitialized;
		}
	},
	methods: {
		nextWallpaper() {
			if (this.usingDefaultWallpaper) this.$store.commit('nextWallpaper');
			else this.retryLoadWallpapers();
		},
		retryLoadWallpapers() {
			this.$store.dispatch('getWallpapersFromCollection');
		}
	}
}
</script>

<style scoped>
.widget-wallpaper-details {
	margin: -.5rem;
	padding: .75rem .75rem .5rem .5rem;
	width: 100%;
	align-self: end;
	justify-self: stretch;
	opacity: 0.5;
	font-size: 0.875rem;
	display: inline-flex;
	flex-direction: column-reverse;
	transition: all .3s ease-out;
}

.widget-wallpaper-details:hover {
	opacity: 1;
}

.location {
	opacity: 0;
	transition: all .3s ease-out;
}

.widget-wallpaper-details:hover .location {
	opacity: 1;
}

.row-bottom {
	display: flex;
	align-items: flex-end;
	position: relative;
	height: 24px;
}

.widget-wallpaper-details:hover .load-btn {
	opacity: 1;
	transform: translateX(0);
}

.widget-wallpaper-details:hover .attribution {
	transform: translateX(0);
}

.attribution {
	font-size: 0.875rem;
	margin-left: 10px;
	line-height: 18px;
	transform: translateX(-28px);
	transition: all .3s ease-out;
}

.load-btn {
	font-size: 0.75rem;
	background: none;
	color: white;
	border: none;
	padding: 0;
	min-width: 18px;
	height: 18px;
	opacity: 0;
	transform: translateX(5px);	
	transition: all .3s ease-out;
}

.load-btn > svg {
	width: 18px;
	height: 18px;
	fill: currentColor;
}


</style>
