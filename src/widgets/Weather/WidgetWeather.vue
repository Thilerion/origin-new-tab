<template>
	<div class="widget-weather" v-if="canShow && currently">
		<Climacon v-if="currently.icon" :icon="currently.icon" />
		<div class="temperature">{{currently.temperature | roundNumber}}&deg;</div>
		<div class="location">{{formattedAddress}}</div>
	</div>
</template>

<script>
import { register, persist } from './store.js';
import EnableWidgetStore from '@/mixins/EnableWidgetStore';

import Climacon from './Climacon.vue';

export default {
	name: "WidgetWeather",
	mixins: [EnableWidgetStore({
		namespace: 'weather', register, persist
	})],
	components: {
		Climacon
	},
	data() {
		return {
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
		formattedAddress() {
			try {
				return this.$store.state.weather.data.position.address.formattedAddress;
			} catch(e) {
				return '';
			}
		}
	},
	methods: {
		
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
	width: 100%;
	height: 100%;
}

.icon *, .icon {
	width: 32px;
	height: 32px;
	color: white;
}
</style>
