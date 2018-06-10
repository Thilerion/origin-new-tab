<template>
	<div class="widget-calendar">
		<div v-for="(day, key, index) in eventsByDay" :key="index">
			<p class="day" :class="{today: day[0].daysFromToday === 0}">{{key}}</p>
			<div class="event-content" :class="{currently: new Date(event.start).getTime() < new Date().getTime()}" v-for="(event, index) in day" :key="index">
				<div class="event-name">{{event.summary}}</div>
				<div class="event-time event-all-day" v-if="event.allDay">Hele dag</div>
				<div class="event-time" v-else>{{event.formattedTimeStart}} - {{event.formattedTimeEnd}}</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	mounted() {
		this.$store.dispatch('getCalendarList');
	},
	computed: {
		eventsUpcomingWeek() {
			return this.$store.getters.eventsUpcomingWeek;
		},
		eventsByDay() {
			return this.$store.getters.eventsByDay;
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
