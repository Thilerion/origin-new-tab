<template>
	<div class="widget-weather f-shadow-medium widget-no-select" @click="extend" v-if="dataLoadSuccessful">
		<StartClimacon v-if="icon" :icon="icon" class="icon f-shadow-light"></StartClimacon>
		<p class="temperature">{{currently.temperature | roundNumber}}&deg;</p>
		<p class="location">{{addressCity}}</p>
		<div class="row-extended">
			<StartWeatherExtended class="extended" v-show="showExtended && dataLoadSuccessful" :forecast="forecast.daily" />
		</div>		
	</div>
</template>

<script>
import StartClimacon from '../shared/Climacon.vue';
import StartWeatherExtended from './WeatherExtended.vue';

import {mapState, mapGetters} from 'vuex';

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
		...mapState('weather', ['forecast']),
		...mapGetters('weather', [
			'addressCity',
			'dataLoadSuccessful',
			'dataLoadFailed',
			'useCustomLocation',
			'customLocationQuery'
		]),
		currently() {
			return this.forecast.currently;
		},
		icon() {
			if (this.currently) return this.currently.icon;
		},
		watchSettings() {
			return [this.useCustomLocation, this.customLocationQuery];
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
	},
	watch: {
		watchSettings: {
			handler(newValue, oldValue) {
				const useCustom = newValue[0];
				const useCustomOld = oldValue[0];
				const customQuery = newValue[1];
				const customQueryOld = oldValue[1];

				const useCustomChanged = useCustom !== useCustomOld;
				const customQueryChanged = customQuery !== customQueryOld;

				console.log(newValue, oldValue);

				if (customQueryChanged) {
					this.$store.commit('weather/resetCustomCoordinates');
				}
				if (useCustom && !customQuery) {
					return;
				}

				console.log("Dispatching settings changed now");
				this.$store.dispatch('weather/settingsChanged');
			},
			deep: true
		}
	}
}
</script>

<style scoped>
.w-align-left {
	margin: 0 auto auto 0;
	padding-left: 1em;
	grid-template-columns: auto auto auto;
	justify-items: start;
}

.w-align-center {
	margin: 0 auto auto auto;
	grid-template-columns: repeat(4, 1fr);
	justify-items: start;
}

.w-align-right {
	margin: 0 0 auto auto;
	padding-right: 1em;
	grid-template-columns: auto auto auto;
	justify-items: start;
}

.w-align-left .temperature {
	grid-column: 1;
	justify-self: end;
	text-align: right;
}

.w-align-center .temperature {
	grid-column: 3 / 5;
	text-align: center;
	justify-self: start;
	margin-right: 1.5rem;
}

.w-align-right .temperature {
	grid-column: 3;
	justify-self: end;
	text-align: right;
}

.w-align-left .location {
	text-align: left;	
	justify-self: start;
	grid-column: 1 / 4;
}

.w-align-center .location {
	text-align: center;
	justify-self: center;
	grid-column: 1 / 5;
}

.w-align-right .location {
	text-align: right;	
	justify-self: end;
	grid-column: 1 / 4;
}

.w-align-left .icon {
	grid-column: 2;
	align-self: center;
	justify-self: end;
}

.w-align-center .icon {
	grid-column: 1 / 3;
	align-self: center;
	justify-self: end;
	margin-left: 1.5rem;
}

.w-align-right .icon {
	grid-column: 2;
	align-self: center;
	justify-self: end;
}

.w-align-left .row-extended {
	grid-column: 1 / 4;
	margin-left: -5px;
	justify-self: start;
}

.w-align-center .row-extended {
	grid-column: 1 / 5;
	justify-self: center;
}

.w-align-right .row-extended {
	grid-column: 1 / 4;
	margin-right: -5px;	
	justify-self: end;
}

.widget-weather {
	position: relative;
	display: grid;
	grid-template-rows: auto auto auto;
	cursor: pointer;
	font-size: 1em;
}

.icon {
	grid-row: 1;
	height: 3em;
	width: 3em;
}

.temperature {
	font-size: 2em;
	grid-row: 1;
	align-self: center;
}

.location {
	grid-row: 2;
	color: rgba(255,255,255,1);
	font-weight: 300;
	font-size: 0.75em;
	letter-spacing: 0.075em;
	text-transform: uppercase;
	min-width: 5.75em;
}

.row-extended {
	grid-row: 3;
	position: relative;
	cursor: default;
}

.extended {
	top: 0;
	/* position: absolute; */
}
</style>
