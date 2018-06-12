<template>
	<div class="widget-weather f-shadow-medium widget-no-select" @click="extend" v-if="weatherDataLoaded">
		<StartClimacon v-if="icon" :icon="icon" class="icon f-shadow-light"></StartClimacon>
		<p class="temperature">{{currently.temperature | roundNumber}}&deg;</p>
		<!-- <p class="summary">{{currently.summary}}</p> -->
		<p class="location">{{addressCity}}</p>
		<div class="row-extended">
			<StartWeatherExtended class="extended" v-show="showExtended && weatherDataLoaded" :forecast="forecast.daily" />
		</div>		
	</div>
</template>

<script>
import StartClimacon from '../shared/Climacon.vue';
import StartWeatherExtended from './WeatherExtended.vue';

export default {
	components: {
		StartClimacon,
		StartWeatherExtended
	},
	data() {
		return {
			showExtended: false
		}
	},
	computed: {
		forecast() {
			return this.$store.getters.forecast;
		},
		currently() {
			return this.forecast.currently;
		},
		addressCity() {
			return this.$store.getters.addressCity;
		},
		icon() {
			if (this.currently) return this.currently.icon;
		},
		weatherDataLoaded() {
			return this.$store.getters.weatherDataLoaded;
		}
	},
	methods: {
		extend() {
			this.showExtended = !this.showExtended;
		}
	},
	filters: {
		roundNumber(n) {
			return Math.round(n);
		}
	}
}
</script>

<style scoped>
.widget-weather {
	margin: 0 0 auto auto;
	padding-right: 0.75em;
	position: relative;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: auto auto auto;
	cursor: pointer;
	font-size: 1em;
}

.icon {
	grid-column: 2;
	grid-row: 1;
	height: 3em;
	width: 3em;
	align-self: center;
	justify-self: end;
}

.temperature {
	grid-column: 3;
	grid-row: 1;
	justify-self: end;
	text-align: right;
	align-self: center;
	font-size: 2em;
}

.summary {
	grid-column: 1 / 4;
	grid-row: 2;
	text-align: center;	
	font-size: 0.875em;
}

.location {
	justify-self: end;
	grid-column: 1 / 4;
	grid-row: 2;
	text-align: right;
	color: rgba(255,255,255,1);
	font-weight: 300;
	font-size: 0.75em;
	letter-spacing: 0.075em;
	text-transform: uppercase;
	text-align: center;
	min-width: 5.75em;
}

.row-extended {
	grid-row: 3;
	grid-column: 1 / 4;
	position: relative;
	cursor: default;
}

.extended {
	position: absolute;
	top: 0;
	left: -5px;
	right: -5px;
}
</style>
