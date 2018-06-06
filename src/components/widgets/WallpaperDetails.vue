<template>
	<div class="widget-wallpaper-details widget-no-select f-shadow-medium" v-if="showWallpaper">
		<div class="row-bottom">
			<div class="buttons" v-if="!usingDefaultWallpaper">
				<button class="icon-btn load-btn" @click="nextWallpaper" alt="Next wallpaper">
					<StartSvgIcon icon="refresh"/>
				</button>
				<a :href="downloadUrl" class="icon-btn dl-btn" target="_blank" alt="Download wallpaper">
					<StartSvgIcon icon="download"/>
				</a>
				<button class="icon-btn hide-btn" @click="hideWallpaper" alt="Hide wallpaper">
					<StartSvgIcon icon="close"/>
				</button>
			</div>

			<p
				v-if="currentWallpaper.user"
				class="attribution f-shadow-heavy"
			>Photo by <a :href="userUrl" target="_blank">{{currentWallpaper.user}}</a> on <a :href="unsplashUrl" target="_blank">Unsplash</a></p>
			<p
				v-else
				class="attribution"
				:class="{'default-wallpaper': usingDefaultWallpaper}"
			>Photo from <a :href="unsplashUrl" target="_blank">Unsplash</a></p>
		</div>		

		<transition name="fade-location" mode="out-in">
		<p
			v-if="currentWallpaper.location"
			class="location"
			:key="currentWallpaper.location"
		>{{currentWallpaper.location}}</p>
		</transition>
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
			return this.$store.getters.showDefaultWallpaper;
		},
		currentWallpaper() {
			return this.$store.getters.wallpaperToShow;
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
		showWallpaper() {
			return this.$store.getters.showWallpaper;
		},
		downloadUrl() {
			try {
				if (this.currentWallpaper.urlDownload) return `${this.currentWallpaper.urlDownload}${this.unsplashReferralSuffix}`;
				else return `${this.currentWallpaper.url}${this.unsplashReferralSuffix}`;
			}
			catch(e) {
				return;
			}
		},
		hasLocation() {
			return !!this.currentWallpaper.location;
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
	user-select: text;
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

.widget-wallpaper-details:hover .attribution, .attribution.default-wallpaper {
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

.fade-location-enter-active, .fade-location-leave-active {
	transition: opacity 0.2s;
}

.fade-location-enter, .fade-location-leave-to {
	opacity: 0!important;
}
</style>
