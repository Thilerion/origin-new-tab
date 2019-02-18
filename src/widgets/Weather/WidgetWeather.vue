<template>
	<div class="widget-weather" v-if="canShow">
		<div class="forecast" v-if="currently">
			<span class="temperature">{{currently.temperature}}&deg;C</span>
			<span class="summary">{{currently.summary}}</span>
			<span class="icon-name">{{currently.icon}}</span>
			<span class="icon"><Climacon :icon="currently.icon" /></span>
		</div>
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
		
	}
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
