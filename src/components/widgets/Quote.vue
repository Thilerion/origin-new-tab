<template>
	<div v-if="quoteLoaded" class="widget-quote widget-no-select f-shadow-heavy">
		<p class="quote f-align-l"><span class="q-mark q-mark-top f-shadow-medium">‟ </span>{{quote.randomQuote.quote | removeDot}}<span class="q-mark q-mark-bot f-shadow-medium">&nbsp;„</span></p>
		<p class="author f-align-r f-style-italic">~ {{quote.randomQuote.author}}</p>	
		<button class="reload-btn" @click="reloadQuote">
			<StartSvgIcon icon="refresh"/>
		</button>
		
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
	methods: {
		reloadQuote() {
			this.$store.dispatch('getQuoteFromServer');
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
.widget-quote {
	align-self: stretch;
	cursor: default;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.quote {
	font-size: 1.25rem;
	margin-bottom: 0.25em;
	padding-right: 2em;
	text-align: center;
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

.reload-btn {
	position: absolute;
	padding: 0;
	margin: 0;
	background: none;
	border: none;
	color: inherit;
	top: 20%;
	right: -3px;
	min-width: 18px;
	width: 18px;
	height: 18px;
	opacity: 0;
	transition: opacity .2s ease;
}

.widget-quote:hover .reload-btn {
	opacity: 1;
}
</style>
