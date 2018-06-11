<template>
	<div class="widget-calendar">

		<div v-if="dataLoaded === false">
			<button @click="retryLoading">Probeer opnieuw</button>
		</div>

		<div v-else-if="permission === true && dataLoaded === null">
			Loading...
		</div>

		<div v-else-if="permission === false && dataLoaded === null">
			<button @click="getPermission">Geef toestemming</button>
		</div>

		<div v-else-if="permission && dataLoaded">
			<div v-for="(day, key, index) in eventsByDay" :key="index">
				<p class="day" :class="{today: day[0].daysFromToday === 0}">{{key | formatCalendar(calendarFormat)}}</p>
				<div class="event-content" :class="{currently: new Date(event.start).getTime() < new Date().getTime()}" v-for="(event, index) in day" :key="index">
					<div class="event-name">{{event.summary}}</div>
					<div class="event-time event-all-day" v-if="event.allDay">Hele dag</div>
					<div class="event-time" v-else>{{event.start | formatTime(timeFormat)}} - {{event.end | formatTime(timeFormat)}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import format from "date-fns/format";
import nlLocale from 'date-fns/locale/nl';
import addDays from 'date-fns/add_days';

export default {
	computed: {
		eventsByDay() {
			return this.$store.getters.calendarEvents;
		},
		permission() {
			return this.$store.getters.calendarPermission;
		},
		token() {
			return !!this.$store.getters.calendarToken;
		},
		dataLoaded() {
			return this.$store.getters.calendarDataLoaded;
		},
		timeFormat() {
			return this.$store.getters.timeFormat;
		},
		calendarFormat() {
			return this.$store.getters.calendarFormat;
		}
	},
	methods: {
		getPermission() {
			this.$store.dispatch('getGoogleAuthTokenInteractive');
		},
		retryLoading() {
			this.$store.dispatch('retryLoading');
		}
	},
	filters: {
		formatTime: (date, timeFormat) => {
			return format(date, timeFormat);
		},
		formatCalendar: (daysFromNow, calendarFormat) => {
			const date = addDays(new Date(), daysFromNow);
			return format(date, calendarFormat, {locale: nlLocale});
		}
	}
}
</script>

<style scoped>
.widget-calendar {
	align-self: flex-start;
	width: 100%;
	margin: unset;
	text-align: left;
	font-size: 12px;
}

.day.today {
	background: rgba(255, 255, 255, 0.1);
	font-weight: bold;
	padding: 0.25em 0;
	font-size: 14px;
	border-bottom: 2px solid white;
}

.event-content {
	display: flex;
	justify-content: space-between;
	margin-bottom: 1em;
}

.currently.event-content {
	background: rgba(255, 255, 255, 0.1);
	font-weight: bold;
	padding: 0.25em 0;
}

.event-name {
	flex: 1 1 50%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.event-time {
	flex: 0 0 auto;
	margin-left: 0.5em;
	text-align: right;
}

.event-all-day {
	text-transform: uppercase;
}
</style>
