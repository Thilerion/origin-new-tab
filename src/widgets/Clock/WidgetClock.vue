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
		>{{timeOfDayMsg}}, <span class="username">{{username}}</span>.</div>
	</div>
</template>

<script>
import { toLocaleDate, msUntilNextMinute, formatTime } from '@/utils/dateTimeHelpers';
import { mapState } from 'vuex';

export default {
	name: 'WidgetClock',
	data() {
		return {
			time: new Date(),

			timeoutId: null
		}
	},
	computed: {
		...mapState({
			username: state => state.settings.general.username,
			timeFormat: state => state.settings.general.timeFormat,
			language: state => state.settings.general.language,
			showDate: state => state.settings.clock.showDate,
			showTextGreeting: state => state.settings.clock.showTextGreeting
		}),
		formattedTime() {
			return formatTime(this.time, this.timeFormat);
		},
		formattedDate() {
			return toLocaleDate(this.time, this.language);
		},
		// TODO: i18n
		timeOfDayMsg() {
			const curHour = this.time.getHours();
			const msg = [
				'Good morning',
				'Hi',
				'Good evening',
				'Good night'
			];

			if (curHour < 5) return msg[3];
			if (curHour < 12) return msg[0];
			if (curHour < 18) return msg[1];
			return msg[2];
		}
	},
	methods: {
		startTimeout() {
			// Wait until nextMinute + 40ms tolerance
			const delay = msUntilNextMinute(this.time) + 40;
			this.timeoutId = setTimeout(() => {
				this.time = new Date();
			}, delay);
		},
		stopTimeout() {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	},
	beforeMount() {
		this.startTimeout();
	},
	beforeDestroy() {
		this.stopTimeout();
	}
}
</script>

<style scoped>
.widget-clock {
	display: flex;
	flex-direction: column;
	text-align: center;
	white-space: nowrap;
}

.time {
	font-variant-numeric: tabular-nums;
	font-size: 7em;
}

.date {
	font-size: 1.5em;
}

.greeting {
	font-size: 3em;
	margin-top: 0.25em;
}
</style>
