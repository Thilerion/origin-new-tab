<template>
	<div class="widget-greeting widget-no-select f-shadow-heavy f-shadow-wide f-align-c cursor-default">
		<div class="time">{{time | toTimeString(currentTimeFormat)}}</div>
		
		<div
			class="message"
			@dblclick="editUsername"
		>{{timeOfDayMessage}}, <span class="username" v-if="!isEditingUsername">{{username}}</span><input class="username-input" v-else v-focus v-model="usernameInput" @keyup.enter="saveUsername"><span class="input-help">Druk op [enter] om op te slaan</span>.</div>
	</div>
</template>

<script>
import formatTime from 'date-fns/format';
import endOfMinute from 'date-fns/end_of_minute';
import diffInMs from 'date-fns/difference_in_milliseconds';
import getHours from 'date-fns/get_hours';

const TIMEOUT_MARGIN = 20; //ms

export default {
	data() {
		return {
			time: new Date(),
			timeout: null,
			usernameInput: this.username
		}		
	},
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
			return this.getTimeOfDay(this.time);
		},
		timeOfDayMessage() {
			return this.$store.getters.greetingMessages.timeOfDay[this.timeOfDay];
		},
		username() {
			return this.$store.getters.username;
		},
		isEditingUsername() {
			return this.$store.getters.isEditingUsername;
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
.widget-greeting {
	align-self: center;
}

.time {
	font-size: 8rem;
}

.username {
	font-size: inherit;
}

.message {
	font-size: 3.5rem;
	position: relative;
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

.username-input {
	padding: 1rem;
	font-size: 2rem;
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
