<template>
	<div class="widget-weather-extended">
		<ul class="forecast-list">
			<li class="forecast-item" :style="{'background-color': baseColor}" v-for="day in forecastDays" :key="day.time">{{day.time}}</li>
		</ul>
	</div>
</template>

<script>
import StartClimacon from '../shared/Climacon.vue';

import differenceInDays from 'date-fns/difference_in_calendar_days';

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
		}
	}
}
</script>

<style scoped>

</style>
