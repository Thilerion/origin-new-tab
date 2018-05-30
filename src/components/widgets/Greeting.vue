<template>
	<div class="widget-greeting f-shadow-medium f-align-c cursor-default">
		<div class="time">{{time | toTimeString(currentTimeFormat)}}</div>
		
		<div
			class="message"
		>{{timeOfDayMessage}}, {{username}}.</div>
	</div>
</template>

<script>
import formatTime from 'date-fns/format';
import endOfMinute from 'date-fns/end_of_minute';
import diffInMs from 'date-fns/difference_in_milliseconds';

import getTimeOfDay from '@/utils/timeOfDay';

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
			return this.$store.getters.greetingMessages.timeOfDay[this.timeOfDay];
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
.time {
	font-size: 8rem;
}

.message {
	font-size: 3.5rem;
	position: relative;
	user-select: none;
}

.message > span {
	font-size: inherit;
}

.input-wrapper {
	position: absolute;
	right: 0;
	top: 0;
	width: 100%;
	height: 100%;
	font-size: inherit;
	overflow: hidden;
}
</style>
