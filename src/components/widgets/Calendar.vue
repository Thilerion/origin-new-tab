<template>
	<div class="widget-calendar" v-if="permission && token">
		<div v-for="(day, key, index) in eventsByDay" :key="index">
			<p class="day" :class="{today: day[0].daysFromToday === 0}">{{key}}</p>
			<div class="event-content" :class="{currently: new Date(event.start).getTime() < new Date().getTime()}" v-for="(event, index) in day" :key="index">
				<div class="event-name">{{event.summary}}</div>
				<div class="event-time event-all-day" v-if="event.allDay">Hele dag</div>
				<div class="event-time" v-else>{{event.formattedTimeStart}} - {{event.formattedTimeEnd}}</div>
			</div>
		</div>
	</div>
	<div class="widget-calendar" v-else-if="!permission">
		<button @click="getPermission">Geef toestemming</button>
	</div>
	<div class="widget-calendar" v-else>
		Probleem met laden...
		<button @click="retryLoading">Probeer opnieuw</button>
	</div>
</template>

<script>
export default {
	computed: {
		eventsUpcomingWeek() {
			return this.$store.getters.eventsUpcomingWeek;
		},
		eventsByDay() {
			return this.$store.getters.eventsByDay;
		},
		permission() {
			return this.$store.getters.permission;
		},
		token() {
			return !!this.$store.getters.token;
		}
	},
	methods: {
		getPermission() {
			this.$store.dispatch('getGoogleAuthTokenInteractive');
		},
		retryLoading() {
			this.$store.dispatch('removeCachedAuthToken')
				.then(() => this.$store.dispatch('getGoogleAuthTokenSilent'))
				.then(() => this.$store.dispatch('getCalendarList'));	
		}
	}

	/* IN CREATED:
	this.$store.dispatch('getGoogleAuthTokenSilent')
		.then(() => {
			if (this.$store.getters.permission === false) {
				this.$store.dispatch('changeWidgetActive', {name: 'calendar', active: false});
				console.warn("FIRST GIVE PERMISSION BEFORE ACTIVATING THE CALENDAR WIDGET!");
			}
		})
	*/

	/* IN SETTINGS:
	googleOAuth() {
		this.$store.dispatch('getGoogleAuthTokenInteractive')
			.then(() => {
				if (this.$store.getters.permission) {
					console.log("PERMISSION GRANTED FOR CALENDAR WIDGET, CAN NOW BE ACTIVATED");
				} else {
					console.warn("This is an error handler for the thingie in settings, getting google oauth token.");
				}					
			});
	}
	*/
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
