<template>
	<div class="widget-clock shadow-40-wide">
		<div class="time">{{formattedTime}}</div>
		<div
			class="date"
			v-if="showDate"
		>{{formattedDate}}</div>

		<div
			class="greeting"
			v-if="showTextGreeting"
		>{{$t(`clock.timeOfDay[${timeOfDayMsg}]`)}}, <span v-if="username" class="username">{{username}}</span><input @blur="saveUsername" @keypress.enter="saveUsername" class="input-username" v-model="usernameTemp" type="text" v-else v-focus>.</div>
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

			timeoutId: null,

			usernameTemp: ''
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
			const locale = this.$i18n.locale;
			return toLocaleDate(this.time, locale);
		},
		// TODO: i18n
		timeOfDayMsg() {
			const curHour = this.time.getHours();
			if (curHour < 5) return 3;
			if (curHour < 12) return 0;
			if (curHour < 18) return 1;
			return 2;
		},
	},
	methods: {
		startTimeout() {
			// Wait until nextMinute + 40ms tolerance
			const delay = msUntilNextMinute(this.time) + 40;
			this.timeoutId = setTimeout(() => {
				this.time = new Date();
				this.startTimeout();
			}, delay);
		},
		stopTimeout() {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		},
		saveUsername() {
			if (!this.usernameTemp) return;

			this.$store.commit('updateSettings', {
				key: 'general',
				settings: {
					username: `${this.usernameTemp}`
				}
			})
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

.input-username {
	width: 7em;
	background: none;
	padding: 6px;
	border: 3px solid transparent;
	outline: none;
	border-bottom-color: white;
	color: white;
	caret-color: white;
	border-radius: 6px 6px 0 0 ;
}

.input-username:active, .input-username:focus {
	border-bottom-color: cyan;
	background-color: rgba(255, 255, 255, 0.3);
}
</style>
