<template>
<transition name="slide-list" appear>
	<div class="widget-weather-extended">		
		
		<ul class="forecast-list">
			<div class="background-image" :style="backgroundImage"></div>
			
			<li class="forecast-item" v-for="(day, index) in forecastDays" :key="day.time">
				<div class="forecast-item-background" :style="{'background-color': bgColors[index]}"></div>
				<div class="forecast-item-content">
					<StartClimacon class="small-climacon" :icon="day.icon" />
					<p class="day">{{day.time | formatDate}}</p>
					<p class="temperatures">{{day.temperatureHigh | roundNumber}}&deg; <span class="night">{{day.temperatureLow | roundNumber}}&deg;</span></p>
				</div>
			</li>
			<li class="forecast-item forecast-ds">
				<div class="forecast-item-background" :style="{'background-color': bgColors[bgColors.length - 1]}"></div>
				<a href="https://darksky.net/poweredby/" target="_blank" class="forecast-ds-text">Powered by Dark Sky</a>
			</li>
		</ul>
		
	</div>
	</transition>
</template>

<script>
import StartClimacon from '../shared/Climacon.vue';

import differenceInDays from 'date-fns/difference_in_calendar_days';
import format from 'date-fns/format';
import nlLocale from 'date-fns/locale/nl';

const BG_COLORS = ['#333333','#434343','#525252','#636363','#747474','#868686','#989898','#aaaaaa'];

export default {
	components: {
		StartClimacon
	},
	props: {
		forecast: {
			type: Array,
			required: true,
			validator(value) {
				return value.length >= 7;
			}
		}
	},
	data() {
		return {
			bgColors: BG_COLORS
		}
	},
	computed: {
		forecastDays() {
			return this.forecast.reduce((acc, day) => {
				if (!acc) acc = {};
				const diff = differenceInDays(new Date(day.time * 1000), new Date());

				//max 7 days, so each day of the week only once
				if (diff >= 0 && diff < 7) {
					acc[diff] = day;
				}

				return acc;
			}, {})
		},
		baseColor() {
			return this.$store.getters.wallpaperColor;
		},
		backgroundImage() {
			if (!this.wallpaperUrlAvailable) return;
			return {'background-image': `url(${this.$store.getters.currentWallpaper.url})`};
		},
		wallpaperUrlAvailable() {
			return this.$store.getters.wallpaperLoadSuccess !== null;
		}
	},
	filters: {
		roundNumber(n) {
			return Math.round(n);
		},
		formatDate(time) {
			const ms = time * 1000;
			const diff = differenceInDays(new Date(ms), new Date());

			if (diff === 0) return 'Vandaag';
			if (diff === 1) return 'Morgen';

			return format(new Date(ms), 'dd D MMM', {locale: nlLocale});
		}
	}
}
</script>

<style scoped>
.widget-weather-extended {
	margin-top: 0.5rem;
	position: relative;
	overflow: hidden;
	padding-left: 5px;
	padding-right: 5px;
	padding-bottom: 5px;
	will-change: opacity;
	--transition-dur: 0.6s;
	--transition-dur1: 0.3s;
	--transition-dur2: 0.3s;
}

.background-image {
	position:absolute;
	top: -10%;
	left: -10%;
	height: 120%;
	width: 120%;
	background-attachment: fixed;
	background-size: cover;
	background-position: center;
	filter: blur(8px) contrast(0.7) brightness(0.95) saturate(130%);
	z-index: -1;
}

.forecast-list {
	position: relative;
	border-radius: 4px;
	list-style: none;
	height: 100%;
	overflow: hidden;
	opacity: 1;
	box-shadow: 0 1px 2px 1px rgba(0,0,0,0.3);	
	will-change: transform;
}

.slide-list-enter-active {
	transition: opacity var(--transition-dur2) ease-in var(--transition-dur1);
}

.slide-list-leave-active {
	transition: opacity var(--transition-dur) ease-out; 
}

.slide-list-enter, .slide-list-leave-to {
	opacity: 0.4;
}

.slide-list-enter-active .forecast-list, .slide-list-leave-active .forecast-list {
	transition-property: transform;
	transition-duration: var(--transition-dur);
	transition-timing-function: ease-in-out;
}

.slide-list-enter .forecast-list, .slide-list-leave-to .forecast-list {
	transform: translateY(-103%);
}

.forecast-item {
	position: relative;
	overflow: hidden;
}

.forecast-item-background {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
	mix-blend-mode: hard-light;
	opacity: 1;
}

.forecast-item:not(:first-of-type) .forecast-item-background::before {
	position: absolute;
	content: "";	
	left: 0;
	top: 0;
	right: 0;
	height: 5px;
	background: rgba(255,255,255,0.1);
	filter: blur(1px);
	transform: translateY(-1px);
	opacity: 0;
}

.forecast-item:not(:first-of-type) .forecast-item-background {
	box-shadow: inset 0 7px 15px -9px rgba(255,255,255,0.1);
}


.forecast-item-content {
	position: relative;
	z-index: 10;
	font-size: 0.875rem;	
	padding: 0.35rem;
	padding-right: 0.5rem;
	padding-left: 0.25rem;
	margin-top: 1px;
	height: 4rem;
	display: grid;
	grid-template-columns: 3.25rem auto;
	grid-template-rows: repeat(2, 1fr);
}

.small-climacon {
	width: 2.5rem;
	grid-row: 1 / 3;
	grid-column: 1;
	align-self: center;
	justify-self: center;
}

.day, .temperatures {
	grid-column: 2;
	justify-self: stretch;
	text-align: left;
	align-self: center;
	margin-left: 0.2rem;
}

.day {
	grid-row: 1;
}

.temperatures {
	grid-row: 2;
}

.temperatures .night {
	font-size: 0.75rem;
	opacity: 0.7;
	margin-left: 0.2rem;
}

.forecast-ds-text {
	display: inline-block;
	font-size: 11px;
	line-height: 1.4;
	opacity: 0.9;
	padding: 0.25em 0.5em;
	cursor: pointer;
	text-decoration: none;
}

.forecast-ds-text:hover {
	text-decoration: underline;
}
</style>
