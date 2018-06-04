<template>
	<div class="widget-weather f-shadow-medium widget-no-select" @click="extend" v-if="weatherDataLoaded">
		<StartClimacon v-if="icon" :icon="icon" class="icon f-shadow-light"></StartClimacon>
		<p class="temperature">{{currently.temperature | roundNumber}} &deg;</p>
		<p class="summary">{{currently.summary}}</p>
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
		location() {
			return this.$store.getters.location;
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
	padding-top: 0.25rem;
	padding-right: 0.75rem;
	position: relative;
	justify-self: end;
	align-self: start;
	display: grid;
	grid-template-columns: auto auto;
	grid-template-rows: auto auto auto auto;
	grid-row-gap: 0.2em;
	grid-column-gap: 0.2em;
	cursor: pointer;
}

.icon {
	grid-column: 1;
	grid-row: 1;
	height: 3.5em;
	width: 3.5em;
	align-self: center;
}

.temperature {
	grid-column: 2;
	grid-row: 1;
	text-align: center;
	align-self: center;
	font-size: 2.75rem;
}

.summary {
	grid-column: 1 / 3;
	grid-row: 2;
	text-align: center;	
}

.location {
	grid-column: 1 / 3;
	grid-row: 3;
	text-align: center;
	font-size: 87.5%;
	color: rgba(255,255,255,1);
	font-weight: 300;
}

.row-extended {
	grid-row: 4;
	grid-column: 1 / 3;
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
