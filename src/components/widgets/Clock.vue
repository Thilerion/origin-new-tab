<template>
	<div
		class="widget-clock widget-no-select f-shadow-heavy f-shadow-wide cursor-default"
		v-show="timeOfDay != null"
	>
		<div
			:class="{'is-12': hasAmPm}"
			class="time">{{formattedTime[0]}}<small v-if="hasAmPm"> {{formattedTime[1]}}</small>
		</div>

		<div
			class="date"
			v-if="showDate"
		>{{time.toLocaleDateString(language, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}}			
		</div>
		
		<div
			class="message"
			@dblclick="editUsername"
			v-if="showTextGreeting"
		>{{$t(`clock.messages[${timeOfDay}]`)}}, <span class="username" v-if="!isEditingUsername">{{username}}</span>
		
			<input class="username-input" v-else v-focus v-model="usernameInput" @keyup.enter="saveUsername"><span class="input-help">{{ $t('clock.saveHint') }}</span>.
		</div>
	</div>
</template>

<script>
import formatTime from 'date-fns/format';
import endOfMinute from 'date-fns/end_of_minute';
import diffInMs from 'date-fns/difference_in_milliseconds';
import getHours from 'date-fns/get_hours';

const TIMEOUT_MARGIN = 20; //ms

import {mapGetters} from 'vuex';

export default {
	data() {
		return {
			time: new Date(),
			timeout: null,
			usernameInput: this.username
		}		
	},
	computed: {
		...mapGetters(['username', 'isEditingUsername', 'showTextGreeting']),
		...mapGetters(['timeFormat', 'language', 'showDate']),
		msUntilMinute() {
			return diffInMs(this.minuteEndsAt, this.time);
		},
		minuteEndsAt() {
			return endOfMinute(this.time);
		},
		timeOfDay() {
			return this.getTimeOfDay(this.time);
		},
		formattedTime() {
			const format = this.timeFormat;
			const dateObject = this.time;
			let formatted = formatTime(dateObject, format).split(' ');
			return formatted;
		},
		hasAmPm() {
			return !!this.formattedTime[1];
		}
	},
	methods: {
		setNewDate() {
			this.time = new Date();
		},
		setNewTimeout() {
			const delay = this.msUntilMinute + TIMEOUT_MARGIN;
			let timeout = setTimeout(() => {
				this.setNewDate();
				this.setNewTimeout();
			}, delay);
			this.timeout = timeout;
		},
		editUsername() {
			this.usernameInput = this.username;
			this.$store.commit('setEditingUsername', true);
		},
		saveUsername() {
			this.$store.commit('setUsername', this.usernameInput);
		},
		getTimeOfDay(date = new Date()) {
			// morning: 5 - 12, day: 12 - 18, evening: 18 - 00, night: 00 - 5
			const hours = getHours(date);
			if (hours < 5) return 3;
			if (hours < 12) return 0;
			if (hours < 18) return 1;
			return 2;
		}
	},
	created() {
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
.w-align-left {
	padding-left: 1em;
	text-align: left;
	white-space: nowrap;
}

.w-align-center {
	text-align: center;
	min-width: 50em;
}

.w-align-right {
	padding-right: 1em;
	text-align: right;
	white-space: nowrap;
}

.w-v-align-top {
	align-self:flex-start;
}

.w-v-align-middle {
	align-self: center;
}

.w-v-align-bottom {
	align-self:flex-end;
}

.widget-clock {
	font-size: inherit;
	width: 100%;
	display: flex;
	flex-direction: column;
}

.time {
	font-size: 8em;
	flex: 0 0 1.2em;
	margin-top: auto;
}

.time > small {
	font-size: 0.3em;
}

.date {
	font-size: 2.5em;
	line-height: 1em;
	margin-bottom: 0.25em;
	flex: 0 0 auto;
}

.username {
	font-size: inherit;
}

.message {
	font-size: 3.5em;
	position: relative;
	flex: 0 0 1.2em;
	margin-bottom: auto;
	white-space: nowrap;
}

.username-input {
	padding: 0 1rem;
	font-size: 0.75em;
	line-height: 1.5;
	width: 10em;
	vertical-align: middle;
	background: none;
	border: none;
	border-bottom: 4px solid white;
	outline: none;
	color: inherit;
	position: relative;
}

.input-help {
	font-size: 14px;
	position: absolute;
	opacity: 0;
	right: 0.8rem;
	bottom: -1.25rem;
	transition: opacity .2s ease;
}

.username-input:focus + .input-help {
	opacity: 1;
}
</style>
