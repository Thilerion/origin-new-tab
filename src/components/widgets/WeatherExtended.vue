<template>
	<div class="widget-weather-extended">		
		<ul class="forecast-list">
			<div class="background-image" :style="backgroundImage"></div>
			<li class="forecast-item" v-for="(day, index) in forecastDays" :key="day.time">
				<div class="forecast-item-background overlay-1" :style="{'background-color': bgColors[index]}"></div>
				<div class="forecast-item-background overlay-2" :style="{'background-color': bgColors[index]}"></div>
				<div class="forecast-item-content">
					<StartClimacon class="small-climacon" :icon="icons[index]" />
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import StartClimacon from '../shared/Climacon.vue';

import differenceInDays from 'date-fns/difference_in_calendar_days';
import { clearTimeout } from 'timers';

const BG_COLORS = ['#111111','#1c1c1c','#262626','#323232','#3d3d3d','#494949','#555555'];

const ICONS = ['partly-cloudy-day', 'clear-night', 'clear-day', 'wind', 'snow', 'cloudy', 'partly-cloudy-day'];

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
			bgColors: BG_COLORS,
			icons: ICONS
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
			return {'background-image': `url(${this.$store.getters.currentWallpaper.url})`};
		}
	}
}
</script>

<style scoped>
.widget-weather-extended {
	padding-top: 0.5rem;
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
	filter: blur(10px) contrast(0.7) brightness(0.95) saturate(130%);
	z-index: -1;
}

.forecast-list {
	position: relative;
	list-style: none;
	border-radius: 4px;
	overflow: hidden;
	box-shadow: 0 2px 5px 0px rgba(0,0,0,0.2);
}

.forecast-item {
	position: relative;
	overflow: hidden;
}

.forecast-item-background {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;	
}

.forecast-item:not(:first-of-type) .overlay-1::before {
	position: absolute;
	content: "";
	width: 100%;
	left: 0%;
	top: 0;
	height: 1px;
	background: rgba(255,255,255,0.1);
	filter: blur(1px);
	transform: translateY(-1px);
}

.overlay-1 {
	z-index: -1;
	mix-blend-mode: hard-light;
	opacity: 1;
}

.overlay-2 {
	z-index: 0;
	opacity: 0;
}

.forecast-item-content {
	position: relative;
	z-index: 10;
	font-size: 12px;
	padding: 0.35rem;
	margin-top: 1px;
	height: 4rem;
}

.small-climacon {
	height: 100%;
}
</style>
