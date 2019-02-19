<template>
	<div class="weather-expanded">
		<transition name="slide">
			<div class="weather-expanded-inner" v-if="show">
				<ul class="daily-list">
					<li class="daily-item" v-for="(day, daysFromNow) in forecast" :key="daysFromNow" :style="listItemBg(daysFromNow)">
						<Climacon class="climacon-small" :icon="day.icon" size="2em" />
						<div class="date">{{formatDate(day.time)}}</div>
						<div class="temperatures">
							<span class="day">{{day.temperatureHigh | roundNumber}}&deg;</span>
							<span class="night">{{day.temperatureLow | roundNumber}}&deg;</span>
						</div>
					</li>
				</ul>
			</div>
		</transition>
	</div>
</template>

<script>
import {differenceInCalendarDays, format} from 'date-fns';
import nlLocale from 'date-fns/locale/nl';
import enLocale from 'date-fns/locale/en';
const locales = {en: enLocale, nl: nlLocale};

import Climacon from './Climacon.vue';

export default {
	components: {
		Climacon
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		daily: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	computed: {
		forecast() {
			return this.daily.reduce((acc, day) => {
				const diff = differenceInCalendarDays(new Date(day.time * 1000), new Date());
				console.log(diff);
				if (diff >= 0 && diff < 7) {
					acc[diff] = day;
				}
				return acc;
			}, {});
		}
	},
	methods: {
		formatDate(time, language) {
			// TODO: language
			const locale = language || this.$store.state.settings.general.language || 'nl';
			const ms = time * 1000;
			const diff = differenceInCalendarDays(new Date(ms), new Date());

			if (diff === 0) return 'Vandaag';
			if (diff === 1) return 'Morgen';
			
			return format(new Date(ms), 'dd D MMM', {locale: locales[locale]});
		},
		listItemBg(idx) {
			const BG_COLORS = ['#333333','#434343','#525252','#636363','#747474','#868686','#989898','#aaaaaa'];
			const n = Number(idx);
			const opacity = Math.round((190 * ((15 - n) / 14))).toString(16);
			return {
				background: `${BG_COLORS[idx]}${opacity}`
			}
		}
	},
	filters: {
		roundNumber(n) {
			return Math.round(n);
		}
	}
}
</script>

<style scoped>
.weather-expanded {
	position: absolute;
	margin-top: 1em;
	right: 0;
	overflow: hidden;
	pointer-events: none;
	border-radius: 4px;
	white-space: nowrap;
	min-width: 5px;
}

.weather-expanded-inner {
	background: rgba(0, 0, 0, 0.4);
	pointer-events: unset;
	border-radius: 4px;
}

.daily-list {
	color: inherit;
}

.daily-item {
	padding: 0.5em 1.25em 0.75em 0.75em;
	display: grid;
	grid-template-columns: 2.7em auto;
	grid-template-rows: auto auto;
}

.climacon-small {
	grid-row: 1 / 3;
	grid-column: 1;
	align-self: center;
	justify-self: start;
}

.date {
	grid-row: 1;
	grid-column: 2;
	margin-bottom: 0.3em;
	font-size: 0.9em;
}

.temperatures {
	grid-row: 2;
	grid-column: 2;
	display: inline-flex;
	align-items: baseline;
}

.day {
	flex: 0 0 40%;
	font-size: 0.8em;
}

.night {
	flex: 0 0 60%;
	font-size: 0.7em;
	opacity: 0.8;
}



.slide-enter-active, .slide-leave-active {
	transition: transform .5s ease;
}

.slide-enter, .slide-leave-to {
	transform: translateY(-100%);
}
</style>
