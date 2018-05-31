<template>
	<div class="widget-weather f-shadow-medium" v-if="fresh">
		<span class="icon">Icon</span>
		<p class="temperature">{{currently.temperature | roundNumber}} &deg;</p>
		<p class="summary">{{currently.summary}}</p>
		<p class="location">{{location.bestAddress}}</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			fresh: this.$store.getters.fresh
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
	justify-self: end;
	align-self: start;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: auto auto auto;
	grid-row-gap: 0.2rem;
	cursor: default;
}

.icon {
	grid-column: 1;
	grid-row: 1;
	text-align: center;
	align-self: center;
}

.temperature {
	grid-column: 2;
	grid-row: 1;
	text-align: center;
	font-size: 2rem;
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
	font-size: 82.5%;
	color: rgba(255,255,255,1);
	font-weight: 300;
}
</style>
