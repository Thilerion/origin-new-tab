<template>
	<div class="widget-weather" v-if="canShow && currently" @click="toggleExpanded">
		<div class="main">
			<Climacon
				class="weather-icon"
				v-if="currently.icon"
				:icon="currently.icon"
			/>
			<div class="temperature">{{currently.temperature | roundNumber}}&deg;</div>
		</div>
		<div class="location">{{formattedAddress}}</div>

		<WidgetWeatherExpanded :show="showExpanded" :daily="daily" />
	</div>
</template>

<script>
import { register, persist } from './store.js';
import EnableWidgetStore from '@/mixins/EnableWidgetStore';

import Climacon from './Climacon.vue';
import WidgetWeatherExpanded from './WidgetWeatherExpanded.vue'

export default {
	name: "WidgetWeather",
	mixins: [EnableWidgetStore({
		namespace: 'weather', register, persist
	})],
	components: {
		Climacon,
		WidgetWeatherExpanded
	},
	data() {
		return {
			showExpanded: false
		}
	},
	computed: {
		canShow() {
			return this.$store.getters['weather/showComponent'];
		},
		forecast() {
			return this.$store.state.weather.data.forecast;
		},
		currently() {
			return this.forecast && this.forecast.currently;
		},
		daily() {
			return this.forecast && this.forecast.daily;
		},
		formattedAddress() {
			try {
				return this.$store.state.weather.data.position.address.city;
			} catch(e) {
				return '';
			}
		}
	},
	methods: {
		toggleExpanded() {
			this.showExpanded = !this.showExpanded;
		}
	},
	filters: {
		roundNumber(n) {
			return Math.round(n);
		}
	},
}
</script>

<style scoped>
.widget-weather {
	cursor: pointer;
}

.main {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-bottom: 0.1em;
	line-height: 2.5em;
}

.temperature {
	text-align: right;
	font-size: 2.25em;
	margin-left: 0.1em;
}

.location {
	text-align: center;
	font-weight: 300;
	font-size: 0.7em;
	letter-spacing: .1em;
	text-transform: uppercase;
	opacity: 0.9;
}
</style>
