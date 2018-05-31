<template>
	<div class="widget-wallpaper-details f-shadow-medium" v-if="wallpaperInitialized">
		<div class="row-bottom">
			<div class="buttons" v-if="!usingDefaultWallpaper">
				<button class="load-btn" @click="nextWallpaper" alt="Next wallpaper">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
						<path d="M0 0h24v24H0z" fill="none"/>
					</svg>
				</button>
				<a :href="downloadUrl" class="dl-btn" target="_blank" alt="Download wallpaper">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
						<path fill="none" d="M0 0h24v24H0z"/>
					</svg>
				</a>
				<button class="hide-btn" @click="hideWallpaper" alt="Hide wallpaper">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
						<path d="M0 0h24v24H0z" fill="none"/>
					</svg>
				</button>
			</div>

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
				return `${this.currentWallpaper.urlUser}${this.unsplashReferralSuffix}`;
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
		},
		downloadUrl() {
			try {
				if (this.currentWallpaper.urlDownload) return `${this.currentWallpaper.urlDownload}${this.unsplashReferralSuffix}`;
				else return `${this.currentWallpaper.url}${this.unsplashReferralSuffix}`;
			}
			catch(e) {
				return;
			}
		}
	},
	methods: {
		nextWallpaper() {
			if (!this.usingDefaultWallpaper) this.$store.commit('nextWallpaper');
			else this.retryLoadWallpapers();
		},
		retryLoadWallpapers() {
			this.$store.dispatch('getWallpapersFromServer');
		},
		hideWallpaper() {
			this.$store.commit('disableCurrentWallpaper');
		}
	}
}
</script>

<style scoped>
.widget-wallpaper-details {
	min-width: 70%;
	align-self: stretch;
	justify-self: start;
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

.buttons {
	display: flex;
	align-items:center;
	justify-content: space-between;
	width: calc(18px * 3 + 4px * 2);
}

.widget-wallpaper-details:hover .buttons {
	opacity: 1;
	transform: translateX(0);
}

.widget-wallpaper-details:hover .attribution {
	transform: translateX(0);
}

.attribution {
	font-size: 0.875rem;
	margin-left: 4px;
	line-height: 18px;
	transform: translateX(-62px);
	transition: all .3s ease-out;
}

.buttons {
	opacity: 0;
	transition: all .3s ease-out;
	transform: translateX(35%);
}

.load-btn, .dl-btn, .hide-btn {
	font-size: 0.75rem;
	background: none;
	color: white;
	border: none;
	padding: 0;
	min-width: 18px;
	height: 18px;
	display: inline-block;
}

.load-btn > svg, .dl-btn > svg, .hide-btn > svg {
	width: 18px;
	height: 18px;
	fill: currentColor;
}


</style>
