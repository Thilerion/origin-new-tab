<template>
	<div class="widget-calendar">
		<h1>Calendar here</h1>
		<button @click="$store.dispatch('getCalendarList')">List</button>
		<div v-for="(event, index) in eventsUpcomingWeek" :key="index">
			<p class="day">{{event.formattedDay}}</p>
			<div class="event-content">
				<div class="event-name">{{event.summary}}</div>
				<div class="event-time" v-if="event.allDay">Hele dag</div>
				<div class="event-time" v-else>{{event.formattedTimeStart}} - {{event.formattedTimeEnd}}</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	mounted() {
		this.$store.dispatch('getGoogleAuthTokenOnStart');
	},
	computed: {
		eventsUpcomingWeek() {
			return this.$store.getters.eventsUpcomingWeek;
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

.event-content {
	display: flex;
	justify-content: space-between;
	margin-bottom: 1em;
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
</style>
