<template>
	<div class="widget-wallpaper-details widget-no-select f-shadow-medium" v-if="wallpaperSource">
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

			<div class="buttons" v-else>
				<button class="icon-btn load-btn" @click="nextWallpaper" alt="Retry loading wallpaper">
					<StartSvgIcon icon="refresh"/>
				</button>
			</div>

			<p
				v-if="wallpaperToShow.user"
				class="attribution f-shadow-heavy"
			>Photo by <a :href="userUrl" target="_blank">{{wallpaperToShow.user}}</a> on <a :href="unsplashUrl" target="_blank">Unsplash</a></p>
			<p
				v-else
				class="attribution"
				:class="{'default-wallpaper': usingDefaultWallpaper}"
			>Photo from <a :href="unsplashUrl" target="_blank">Unsplash</a></p>
		</div>		

		<transition name="fade-location" mode="out-in">
		<p
			v-if="wallpaperToShow.location"
			class="location"
			:key="wallpaperToShow.location"
		>{{wallpaperToShow.location}}</p>
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
		wallpaperToShow() {
			return this.$store.getters.wallpaperToShow;
		},
		wallpaperSource() {
			const wp = this.wallpaperToShow;
			return (wp && wp.url) ? wp.url : null;
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
			if (!this.usingDefaultWallpaper) this.$store.dispatch('goToNextWallpaper');
			else this.retryLoadWallpapers();
		},
		retryLoadWallpapers() {
			this.$store.dispatch('retryLoadingWallpapers');
		},
		hideWallpaper() {
			this.$store.dispatch('hideCurrentWallpaper');
		}
	}
}
</script>

<style scoped>
.w-align-left {
	padding-left: 0.5em;
	margin: auto auto 0 0;
	text-align: left;
}

.w-align-center {
	margin: auto auto 0 auto;
	text-align: center;
}

.w-align-right {
	padding-right: 0.5em;
	margin: auto 0 0 auto;
	text-align: right;
}

.w-align-left .row-bottom {
	justify-content: flex-start;	
}

.w-align-center .row-bottom {
	justify-content: center;	
}

.w-align-right .row-bottom {
	justify-content: flex-end;
}

.w-align-left .buttons {
	order: 1;
	padding-right: 4px;
	transform: translateX(35%);
}

.w-align-center .buttons {
	order: 1;
	padding-left: 4px;
	transform: translateX(31px);
}

.w-align-right .buttons {
	order: 2;
	padding-left: 4px;
	transform: translateX(-35%);
}

.w-align-left .attribution {
	order: 2;
	transform: translateX(-62px);
}

.w-align-center .attribution {
	order: 2;
	transform: translateX(-31px);
}

.w-align-right .attribution {
	order: 1;
	text-align: right;
	transform: translateX(62px);
}

.widget-wallpaper-details {	
	opacity: 0.5;
	display: flex;
	max-width: 100%;
	flex-direction: column-reverse;
	transition: all .3s ease-out;
	white-space: nowrap;
}

.widget-wallpaper-details:hover {
	opacity: 1;
}

.location {
	opacity: 0;
	transition: all .3s ease-out;
	user-select: text;
	font-size: 0.75em;
}

.widget-wallpaper-details:hover .location {
	opacity: 1;
}

.row-bottom {
	display: flex;
	align-items: flex-end;
	position: relative;
	height: 24px;
	font-size: 0.75em;
	flex-shrink: 0;
	min-width: 0;
}

.buttons {
	display: flex;
	align-items:center;
	justify-content: space-between;
	width: calc(18px * 3 + 4px * 2);
	flex-shrink: 0;
	min-width: 0;
}

.widget-wallpaper-details:hover .buttons {
	opacity: 1;
	transform: translateX(0);
}

.widget-wallpaper-details:hover .attribution, .attribution.default-wallpaper {
	transform: translateX(0);
}

.attribution {
	font-size: 1em;
	line-height: 18px;
	transition: all .3s ease-out;
	min-width: 0;
	flex-shrink: 0;
}

.buttons {
	opacity: 0;
	transition: all .3s ease-out;
	min-width: 0;
	flex-shrink: 0;
}

.load-btn, .dl-btn, .hide-btn {
	font-size: 0.75em;
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
