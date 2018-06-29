<template>
	<div class="widget-calendar f-shadow-medium">

		<div v-if="dataLoaded === false">
			<button @click="retryLoading">Probeer opnieuw</button>
		</div>

		<div v-else-if="permission === true && dataLoaded === null">
			Loading...
		</div>

		<div v-else-if="permission === false && dataLoaded === null">
			<button @click="getPermission">Geef toestemming</button>
		</div>

		<div 
			v-else-if="permission && dataLoaded"
			class="calendar-content"
		>

			<div
				v-for="(day, key, index) in calenderEventsMaxAmount"
				:key="index"
				class="calendar-day-wrapper"
			>
				<div class="calendar-day">{{key | formatCalendar(calendarFormat)}}</div>
				<ul	class="calendar-event-list">
					<li
						class="calendar-event-item"
						v-for="(event, index) in day"
						:key="index"
						:class="{'current-event': eventIsNow(event)}"
					>
						<div class="calendar-event-summary">{{event.summary}}</div>
						<div class="calendar-event-time">
							{{formatTime(event)}}
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import format from "date-fns/format";
import nlLocale from 'date-fns/locale/nl';
import addDays from 'date-fns/add_days';
import isWithinRange from 'date-fns/is_within_range'

import {mapState, mapGetters, mapActions} from 'vuex';

export default {
	computed: {
		...mapState('calendar', ['dataLoaded', 'calendarFormat', 'permission']),
		...mapGetters('calendar', ['calenderEventsMaxAmount']),
		...mapGetters(['timeFormat'])
	},
	methods: {
		...mapActions('calendar', {
			getPermission: 'getGoogleAuthTokenInteractive',
			retryLoading: 'retryLoading'
		}),
		formatTime({start, end, allDay}) {
			if (allDay) {
				return 'Hele dag';
			} else {
				return `${format(start, this.timeFormat)} - ${format(end, this.timeFormat)}`;
			}
		},
		eventIsNow({start, end, allDay}) {
			return isWithinRange(new Date(), start, end);
		}
	},
	filters: {
		formatCalendar: (daysFromNow, calendarFormat) => {
			const date = addDays(new Date(), daysFromNow);
			return format(date, calendarFormat, {locale: nlLocale});
		}
	},
	beforeCreate() {
		this.$store.initializeWidget.calendar();
	}
}
</script>

<style scoped>
.widget-calendar {
	align-self: flex-start;
	margin: unset;
	margin-right: auto;
	text-align: left;
	font-size: calc(1em - 2px);
	max-width: 20em;
	padding: .75em;
}

.calendar-day-wrapper {
	margin-bottom: 0.25em;
	font-size: 87.5%;
}

.calendar-day {
	text-transform: capitalize;
	font-weight: 700;
}

.calendar-event-list {
	list-style: none;

	margin-left: 1em;
	line-height: 1.4;
	padding: 0.15em 0;
}

.calendar-event-item {
	/* border-bottom: 1px solid rgba(255,255,255,0.75); */
	/* border-bottom: 1px solid linear-gradient(to right, white calc(10em), transparent 5em); */
	border-width: 0 0 1px 0;
	border-style: solid;
	border-image: linear-gradient(to right, rgba(255,255,255,0.7) calc(100% - 1.5em), transparent calc(100% - 1.5em)) 100% 0/0 0 1px;
	padding-bottom: 0.1em;
}

.calendar-event-item.current-event {
	position: relative;
}

.calendar-event-item.current-event::before {
	position: absolute;
	content: '';
	width: 3px;
	height: calc(100% - 0.1em - 4px);
	background: rgba(255,255,255,0.7);
	left: calc(-1em + 5px);
	top: 2px;
}

.calendar-event-item:not(:last-of-type) {
	margin-bottom: 0.25em;
}

.calendar-event-summary {
	/* white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis; */
	letter-spacing: 0.02em;
	font-weight: 700;
}

.calendar-event-time {
	opacity: 0.8;
	font-size: calc(1em - 1px);
}

.current-event .calendar-event-time {
	opacity: 1;
}
</style>
