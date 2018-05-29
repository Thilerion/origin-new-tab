<template>
	<div>
		<div>{{time | toTimeString(currentTimeFormat)}}</div>
		<div>{{timeOfDayMessage}}, {{username}}.</div>
	</div>
</template>

<script>
import formatTime from 'date-fns/format';
import endOfMinute from 'date-fns/end_of_minute';
import diffInMs from 'date-fns/difference_in_milliseconds';

import getTimeOfDay from '../utils/timeOfDay';

const TIMEOUT_MARGIN = 20; //ms

export default {
	data: () => ({
		time: new Date(),
		timeout: null
	}),
	computed: {
		msUntilMinute() {
			return diffInMs(this.minuteEndsAt, this.time);
		},
		minuteEndsAt() {
			return endOfMinute(this.time);
		},
		currentTimeFormat() {
			return this.$store.getters.timeFormat;
		},
		timeOfDay() {
			return getTimeOfDay(this.time);
		},
		timeOfDayMessage() {
			return this.$store.getters.welcomeMessages.timeOfDay[this.timeOfDay];
		},
		username() {
			return this.$store.getters.username;
		}
	},
	methods: {
		setNewDate() {
			this.time = new Date();
		},
		setNewTimeout() {
			const delay = this.msUntilMinute + TIMEOUT_MARGIN;
			console.log(`Timeout reruns in ${delay} ms`);
			let timeout = setTimeout(() => {
				this.setNewDate();
				this.setNewTimeout();
			}, delay);
			this.timeout = timeout;
		}
	},
	beforeMount() {
		this.setNewTimeout();
	},
	beforeDestroy() {
		clearTimeout(this.timeout);
		this.timeout = null;
	},
	filters: {
		toTimeString(dateObject, formatString) {
			return formatTime(dateObject, formatString);
		}
	}
}
</script>

<style scoped>

</style>
