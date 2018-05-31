<template>
	<div class="widget-weather-extended">
		<ul class="forecast-list">
			<li class="forecast-item" v-for="(day, index) in forecastDays" :key="day.time">
				<div class="forecast-item-background" :style="{'background-color': bgColors[index], 'mix-blend-mode': blendMode}"></div>
				<p>{{blendMode}}</p>
			</li>
		</ul>
	</div>
</template>

<script>
import StartClimacon from '../shared/Climacon.vue';

import differenceInDays from 'date-fns/difference_in_calendar_days';
import { clearTimeout } from 'timers';

const BG_COLORS = ['#222222','#343434','#464646','#5a5a5a','#6e6e6e','#838383','#999999'];
const MODES = ['multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];

export default {
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
			modes: MODES,
			blendModeIndex: 0,
			timeout: null
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
		blendMode() {
			return this.modes[this.blendModeIndex];
		}
	},
	methods: {
		timeoutBlendMode() {
			let timeout = setInterval(() => {
				let prev = this.blendModeIndex;
				let length = this.modes.length - 1;
				this.blendModeIndex = (prev + 1) % length;
			}, 1000);
			this.timeout = timeout;
		}
	},
	beforeMount() {
		this.timeoutBlendMode();
	},
	beforeDestroy() {
		clearInterval(this.timeout);
		this.timeout = null;
	}
}
</script>

<style scoped>
.forecast-list {
	list-style: none;
}

.forecast-item {
	position: relative;
	height: 3rem;
	overflow: hidden;
}

.forecast-item-background {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	z-index: -1;
	mix-blend-mode: screen;
}
</style>
