<template>
	<div
		class="widget-clock"
	>
		<span class="time">{{formattedTime}}</span>
	</div>
</template>

<script>
import { differenceInMilliseconds, addMinutes, format as formatTime, startOfMinute } from 'date-fns';

export default {
	data() {
		return {
			time: new Date(),
			usernameInput: this.username,

			timeoutId: null
		}
	},
	computed: {
		username() {
			return this.$store.state.settings.general.username;
		},
		timeFormat() {
			return this.$store.state.settings.general.timeFormat;
		},
		language() {
			return this.$store.state.settings.general.timeFormat;
		},
		formattedTime() {
			const formatted = formatTime(this.time, this.timeFormat);
			return formatted;
		}		
	},
	methods: {
		refreshTime() {
			this.time = new Date();
		},
		// get time until next minute => the interval delay
		getMsUntilNextMinute() {
			debugger;
			const now = this.time;
			const nextMinute = startOfMinute(addMinutes(now, 1));
			const diff = Math.abs(differenceInMilliseconds(nextMinute, now));
			return diff;
		},
		startTimeout() {
			const delay = this.getMsUntilNextMinute() + 100; // delay by 100ms
			let timeout = setTimeout(() => {
				this.refreshTime();
				this.startTimeout();
			}, delay);
			this.timeout = timeout;
		}
	},
	mounted() {
		this.startTimeout();
	},
	beforeDestroy() {
		clearTimeout(this.timeout);
		this.timeout = null;
	}
}
</script>

<style scoped>
.widget-clock {
	display: flex;
}

.time {
	font-size: 8em;
	flex: 0 0 1.2em;
	margin-top: auto;
}
</style>
