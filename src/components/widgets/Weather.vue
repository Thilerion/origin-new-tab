<template>
	<div class="widget-weather f-shadow-medium" v-if="fresh" @click="showExtended = !showExtended">
		<StartClimacon :icon="currently.icon" class="icon f-shadow-light"></StartClimacon>
		<p class="temperature">{{currently.temperature | roundNumber}} &deg;</p>
		<p class="summary">{{currently.summary}}</p>
		<p class="location">{{addressCity}}</p>
		<div class="row-extended">
			<StartWeatherExtended class="extended" v-if="showExtended" />
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
			fresh: this.$store.getters.fresh,
			showExtended: false
		}
	},
	computed: {
		forecast() {
			return this.$store.getters.forecast;
		},
		computeFresh() {
			return this.$store.getters.fresh;
		},
		location() {
			return this.$store.getters.location;
		},
		currently() {
			return this.forecast.currently;
		},
		addressCity() {
			return this.$store.getters.addressCity;
		}
	},
	watch: {
		computeFresh(newValue, oldValue) {
			if (newValue === true) this.fresh = true;
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
	position: relative;
	justify-self: end;
	align-self: start;
	display: grid;
	grid-template-columns: auto auto;
	grid-template-rows: auto auto auto auto;
	grid-row-gap: 0.2em;
	grid-column-gap: 0.2em;
	cursor: default;
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
}

.extended {
	background: black;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 50vh;
}
</style>
