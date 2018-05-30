<template>
	<div v-if="quoteLoaded" class="widget-quote f-shadow-heavy">
		<p class="quote f-align-l"><span class="q-mark q-mark-top f-shadow-medium">‟ </span>{{quote.randomQuote.quote | removeDot}}<span class="q-mark q-mark-bot f-shadow-medium">&nbsp;„</span></p>
		<p class="author f-align-r f-style-italic">~ {{quote.randomQuote.author}}</p>
	</div>
</template>

<script>
export default {
	computed: {
		quoteLoaded() {
			return this.$store.getters.quoteLoaded;
		},
		quote() {
			return this.$store.getters.quoteWatch;
		}
	},
	filters: {
		removeDot(str) {
			if (str.endsWith('.')) {
				return str.slice(0, -1);
			} else return str;
		}
	}
}
</script>

<style scoped>
.quote {
	font-size: 1.25rem;
	margin-bottom: 0.25em;
	padding-right: 2em;
	text-align-last: right;
	letter-spacing: 0.1px;
	word-spacing: 0.7px;
}

.author {
	letter-spacing: 0.4px;
}

.q-mark {
	font-size: 2rem;
	line-height: 1.25rem;
	color: rgba(255,255,255,0.9);
}

.q-mark-top {
	position: relative;
	top: 0.35rem;
}
</style>
