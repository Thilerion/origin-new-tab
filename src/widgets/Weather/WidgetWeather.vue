<template>
	<div class="widget-weather" v-if="canShow">
		<div class="forecast" v-if="currently">
			<span class="temperature">{{currently.temperature}}&deg;C</span>
			<span class="summary">{{currently.summary}}</span>
		</div>
	</div>
</template>

<script>
import { register, persist } from './store.js';
import EnableWidgetStore from '@/mixins/EnableWidgetStore';

export default {
	name: "WidgetWeather",
	mixins: [EnableWidgetStore({
		namespace: 'weather', register, persist
	})],
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
</style>
