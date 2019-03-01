<template>
	<div class="changelog" v-if="loaded">
		<section class="log-item" v-for="(logItem, i) in sortedLog" :key="i">
			<div class="log-header">
				<h2 class="log-title"><span class="log-version">v{{logItem.version}}</span> - {{logItem.title}}</h2>
				<div class="log-date">{{logItem.date | toDateString}}</div>
			</div>
			<ul class="log-points-list">
				<li class="log-point" v-for="(item, j) in logItem.items" :key="j">{{item}}</li>
			</ul>
		</section>
	</div>
</template>

<script>
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
		}
	},
	mounted() {
		this.loadLogs(this.language);
	},
	watch: {
		language(newValue, oldValue) {
			console.log(`[WhatsNew component]: language changed from ${oldValue} to ${newValue}.`);
		}
	},
	filters: {
		toDateString(val) {
			// TODO: localeDateString
			return val;
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
	padding-bottom: 0.25em;
}
</style>
