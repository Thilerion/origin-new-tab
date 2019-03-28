<template>
	<div class="changelog" v-if="loaded">
		<section class="log-item" v-for="(logItem, i) in sortedLog" :key="i">
			<div class="log-header">
				<h2 class="log-title"><span class="log-version">v{{logItem.version}}</span> - {{logItem.title}}</h2>
				<div class="log-date">{{formatDate(logItem.date)}}</div>
			</div>
			<ul class="log-list">
				<li class="log-list-item" v-for="(item, j) in logItem.items" :key="j">{{item}}</li>
			</ul>
		</section>
	</div>
</template>

<script>
import {toShortLocaleDate} from '@/utils/dateTimeHelpers';

export default {
	data() {
		return {
			loaded: false,
			logArray: []
		}
	},
	computed: {
		language() {
			return this.$i18n.locale;
		},
		sortedLog() {
			return [...this.logArray].sort((a, b) => {
				return Date.parse(b.date) - Date.parse(a.date)
			});
		}
	},
	methods: {
		loadLogs(lang) {
			import(`@/i18n/changelog/${lang}`).then(log => {
				console.log(log.default);
				this.logArray = [...log.default];
				this.loaded = true;
			})
		},
		formatDate(val) {
			const date = new Date(val);
			return toShortLocaleDate(date, this.language);
		}
	},
	mounted() {
		this.loadLogs(this.language);
	},
	watch: {
		language(newValue, oldValue) {
			console.log(`[WhatsNew component]: language changed from ${oldValue} to ${newValue}.`);
		}
	}
}
</script>

<style scoped>
.log-item {
	padding-bottom: 1em;
}

.log-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	padding-bottom: 0.45em;
}

.log-item:last-of-type {
	padding-bottom: 0;
}

.log-date {
	font-size: 0.9em;
}

.log-list {
	margin: 0;
	margin-left: 1em;
	padding: 0;
	list-style: none;
}

.log-list-item {
	position: relative;
	margin-bottom: 0.25em;
}

.log-list-item::before {
	position: absolute;
	content: '-';
	left: -0.75em;
}

</style>
