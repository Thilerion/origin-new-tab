<template>
	<div>
		<div>{{time | toTimeString}}</div>
		<div>{{msUntilMinute}}</div>
	</div>
</template>

<script>
import formatTime from 'date-fns/format';
import endOfMinute from 'date-fns/end_of_minute';
import diffInMs from 'date-fns/difference_in_milliseconds';

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
		toTimeString(dateObject) {
			return formatTime(dateObject, 'HH:mm:ss');
		}
	}
}
</script>

<style scoped>

</style>
