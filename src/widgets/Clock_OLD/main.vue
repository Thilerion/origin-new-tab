<template>
	<div class="widget-clock">
		<div class="time">{{formattedTime}}</div>
		<div
			class="date"
			v-if="showDate"
		>{{formatDateLocaleString}}</div>
		<div
			class="greeting"
			v-if="showTextGreeting"
		>{{timeOfDay}}, <span class="username">{{username}}</span>.</div>
	</div>
</template>

<script>
/**
 * TODO:
 * multiple possible templates (especially wrt date)
 * possibly have date to the left/right of clock, smaller, with
 * the day on a different line than "5 februrary"
 */
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
		// TODO: placeholder name, setup name, change username settings
		username() {
			return this.$store.state.settings.general.username || 'Username';
		},
		timeFormat() {
			return this.$store.state.settings.general.timeFormat;
		},
		language() {
			return this.$store.state.settings.general.language;
		},
		formattedTime() {
			const formatted = formatTime(this.time, this.timeFormat);
			return formatted;
		},

		// TODO: user prefs for how to format date string
		formatDateLocaleString() {
			return this.time.toLocaleDateString(this.language, {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
		},

		curHour() {
			return this.time.getHours();
		},
		// TODO: i18n
		timeOfDay() {
			const msg = [
				'Good morning',
				'Hi',
				'Good evening',
				'Good night'
			];

			if (this.curHour < 5) return msg[3];
			if (this.curHour < 12) return msg[0];
			if (this.curHour < 18) return msg[1];
			return msg[2];
		},
		
		showDate() {
			return this.$store.state.settings.clock.showDate;
		},
		showTextGreeting() {
			return this.$store.state.settings.clock.showTextGreeting;
		}
	},
	methods: {
		refreshTime() {
			this.time = new Date();
		},
		// get time until next minute => the interval delay
		getMsUntilNextMinute() {
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
	flex-direction: column;
	text-align: center;
}

.time {
	font-size: 8em;
	margin-top: auto;
	line-height: 0.95em;
}

.greeting,
.time,
.date {
	white-space: nowrap;
}

.date {
	font-size: 1.5em;
}

.greeting {
	font-size: 3.5em;
	margin-top: 0.25em;
}
</style>
