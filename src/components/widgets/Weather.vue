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
		...mapState('weather', {
			forecast: state => state.data.forecast
		}),
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
	beforeCreate() {
		this.$store.initializeWidget.weather();
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

				if (!useCustomChanged && !customQueryChanged) {
					console.log("No weather settings changes");
					return;
				}
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
.w-v-align-top {
	align-self:flex-start;
	margin-top: 0;
	margin-bottom: auto;
	--row1: 1;
	--row2: 2;
	--row3: 3;
}

.w-v-align-top .extended, .w-v-align-middle .extended {
	top: 0;
}

.w-v-align-bottom .extended {
	bottom: 0;
}

.w-v-align-middle {
	align-self: center;
	--row1: 1;
	--row2: 2;
	--row3: 3;
}

.w-v-align-bottom {
	align-self:flex-end;
	margin-top: auto;
	margin-bottom: 0;
	--row1: 3;
	--row2: 2;
	--row3: 1;
}

.w-align-left {
	margin-right: auto;
	margin-left: 0;
	/* margin: 0 auto auto 0; */
	padding-left: 1em;
	grid-template-columns: auto auto auto;
	justify-items: start;
}

.w-align-center {
	/* margin: 0 auto auto auto; */
	margin-left: auto;
	margin-right: auto;
	grid-template-columns: repeat(4, 1fr);
	justify-items: start;
}

.w-align-right {
	/* margin: 0 0 auto auto; */
	margin-right: 0;
	margin-left: auto;
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

.w-align-left .extended {
	left: 0;
}

.w-align-center .extended {
	left: 0;
	right: 0;
}

.w-align-right .extended {
	right: 0;
}

.widget-weather {
	position: relative;
	display: grid;
	grid-template-rows: auto auto auto;
	cursor: pointer;
	font-size: 1em;
}

.icon {
	grid-row: var(--row1);
	height: 3em;
	width: 3em;
}

.temperature {
	font-size: 2em;
	grid-row: var(--row1);
	align-self: center;
}

.location {
	grid-row: var(--row2);
	color: rgba(255,255,255,1);
	font-weight: 300;
	font-size: 0.75em;
	letter-spacing: 0.075em;
	text-transform: uppercase;
	min-width: 5.75em;
}

.row-extended {
	grid-row: var(--row3);
	position: relative;
	cursor: default;
	width: 100%;
}

.extended {
	position: absolute;
}
</style>
