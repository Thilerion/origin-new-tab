<template>
	<div class="widget-wallpaper-details widget-no-select f-shadow-medium" v-if="showAny">
		<div class="row-bottom" :class="showDefault ? 'default-bg' : null">
			<div class="buttons" v-if="showExternal">
				<button
					class="icon-btn load-btn"
					@click="nextWallpaper"
					alt="Next wallpaper"
					:class="{spinning: loadingImage}"
				>
					<SvgIcon icon="refresh"/>
				</button>
				<a :href="downloadUrl" class="icon-btn dl-btn" target="_blank" alt="Download wallpaper">
					<SvgIcon icon="download"/>
				</a>
				<button class="icon-btn hide-btn" @click="hideWallpaper" alt="Hide wallpaper">
					<SvgIcon icon="close"/>
				</button>
			</div>

			<div class="buttons default-buttons" v-else-if="showDefault">
				<button class="icon-btn load-btn" @click="retryLoadingWallpapers" alt="Retry loading wallpaper">
					<SvgIcon icon="refresh"/>
				</button>
			</div>

			<p
				v-if="currentWallpaper.user"
				class="attribution f-shadow-heavy"
			>{{$t('wallpaperDetails.photoBy')}}<a :href="userUrl" target="_blank">{{currentWallpaper.user}}</a>{{$t('wallpaperDetails.on')}}<a :href="unsplashUrl" target="_blank">Unsplash</a></p>
			<p
				v-else
				class="attribution"
				:class="{'default-wallpaper': showDefault}"
			>{{$t('wallpaperDetails.photoFrom')}}<a :href="unsplashUrl" target="_blank">Unsplash</a></p>
		</div>		

		<p
			v-if="showDefault"
			class="load-error-message"
		>{{$t('wallpaperDetails.loadError')}}
		</p>

		<transition name="fade-location" mode="out-in">
			<div class="location"><p
				v-if="currentWallpaper.location"
				class="location-inner"
				:key="currentWallpaper.location"
			>{{currentWallpaper.location}}</p></div>
		</transition>
	</div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

export default {
	data() {
		return {
			unsplashBaseUrl: "https://unsplash.com/",
			unsplashReferralSuffix: "?utm_source=23899&utm_medium=referral"
		}
	},
	computed: {
		...mapState('wallpaper', [
			'loadingImage',
			'errorLoadingImage'
		]),
		...mapGetters('wallpaper', [
			'dataLoadSuccessful',
			'dataLoadFailed',
			'showAny',
			'showExternal',
			'showDefault',
			'currentWallpaper'
		]),
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
		wallpaperSource() {
			const wp = this.currentWallpaper;
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
			if (this.loadingImage) {
				console.warn("Cannot go to next wallpaper, as previous is still loading.");
				return;
			}
			if (this.showExternal) {
				this.$store.dispatch('wallpaper/goToNext');
			}
			
		},
		hideWallpaper() {
			if (this.loadingImage) {
				console.warn("Cannot hide wallpaper, as it is still loading.");
				return;
			}
			if (this.showExternal) {
				this.$store.dispatch('wallpaper/hideCurrent');
			} else {
				console.warn('Cannot hide wallpaper, as it is the default wallpaper.');
			}
		},
		retryLoadingWallpapers() {
			if (this.loadingImage) {
				console.warn("Cannot retry loading because an image is still being loaded.");
			} else if (this.showExternal && !this.errorLoadingImage) {
				console.warn("Cannot retry loading because an external wallpaper is being displayed, and no error in loading an image is found.");
			} else {
				console.log('Dispatching "retryLoadingWallpapers" now.');
				this.$store.dispatch('wallpaper/retryLoading');
			}
			
		}
	}
}
</script>

<style scoped>
.w-v-align-top {
	align-self:flex-start;
	flex-direction: column;
}

.w-v-align-top .row-bottom {
	margin-top: 0;
	margin-bottom: 0.1em;
}

.w-v-align-middle {
	align-self: center;
	flex-direction: column-reverse;
}

.w-v-align-bottom {
	align-self:flex-end;
	flex-direction: column-reverse;
}

.w-align-left {
	padding-left: 0.5em;
	/* margin: auto auto 0 0; */
	margin-right: auto;
	margin-left: 0;
	text-align: left;
}

.w-align-center {
	/* margin: auto auto 0 auto; */
	margin-left: auto;
	margin-right: auto;
	text-align: center;
}

.w-align-right {
	padding-right: 0.5em;
	/* margin: auto 0 0 auto; */
	margin-right: 0;
	margin-left: auto;
	text-align: right;
}

.w-align-left .row-bottom, .w-align-left {
	justify-content: flex-start;	
}

.w-align-center .row-bottom, .w-align-center {
	justify-content: center;	
}

.w-align-right .row-bottom, .w-align-right {
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

.w-align-left .default-bg .attribution {
	transform: translateX(-22px);
}

.w-align-center .attribution {
	order: 2;
	transform: translateX(-31px);
}

.w-align-center .default-bg .attribution {
	transform: translateX(-11px);
}

.w-align-right .attribution {
	order: 1;
	text-align: right;
	transform: translateX(62px);
}

.w-align-right .default-bg .attribution {
	transform: translateX(22px);
}

.w-align-right .location-inner {
	float: right;
}

.location, .location-inner {
	text-align: inherit;
}

.widget-wallpaper-details {	
	opacity: 0.5;
	display: flex;
	max-width: 100%;
	transition: all .3s ease-out;
	white-space: nowrap;
	min-height: 2em;
	justify-content: flex-start;
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

.load-error-message {
	opacity: 0.5;
	transition: all .3s ease-out;
	font-size: 0.75em;
}

.widget-wallpaper-details:hover .location, .widget-wallpaper-details:hover .load-error-message {
	opacity: 1;
}

.load-error-message + .location {
	margin-bottom: 0.25em;
}

.row-bottom {
	display: flex;
	align-items: flex-end;
	position: relative;
	margin-top: 0.1em;
	font-size: 0.75em;
	flex-shrink: 0;
	min-width: 0;
}

.buttons {
	display: flex;
	align-items:center;
	justify-content: space-between;
	width: 62px;
	flex-shrink: 0;
	min-width: 0;
	opacity: 0;
	transition: all .3s ease-out;
}

.default-bg .buttons {
	width: 22px;
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

.load-btn {
	transform: rotate(0deg);
	transition: transform 0.4s;
}

.load-btn.spinning {
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	99% {
		transform: rotate(360deg);
	}
	100% {
		transform: rotate(0deg);
	}
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
