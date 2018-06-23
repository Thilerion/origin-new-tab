<template>
	<div v-if="dataLoaded" class="widget-quote widget-no-select f-shadow-heavy" :key="quote">
		<p class="quote"><span class="q-mark q-mark-top f-shadow-medium">‟ </span>{{quote | removeDot}}<span class="q-mark q-mark-bot f-shadow-medium">&nbsp;„</span></p>
		<p class="author f-style-italic">~ {{author}}</p>	
		<button class="icon-btn reload-btn" @click="reloadQuote">
			<StartSvgIcon icon="refresh"/>
		</button>
		
	</div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

export default {
	computed: {
		...mapState('quote', ['dataLoaded']),
		...mapGetters('quote', ['quote', 'author'])
	},
	methods: {
		reloadQuote() {
			this.$store.dispatch('quote/getQuoteFromServer');
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
.w-align-left {
	text-align: left;
	margin: auto auto auto 1em;
}

.w-align-center {
	min-width: 40em;
	margin: auto;
}

.w-align-center .quote {
	text-align: left;
	padding-right: 2em;
}

.w-align-center .author {
	text-align: right;
}

.w-align-right {
	text-align: right;
	margin: auto 1em auto auto;
}

.widget-quote {
	font-size: inherit;
	cursor: default;
	position: relative;
	display: flex;
	flex-direction: column;
	
}

.quote {
	font-size: 1.25em;
	margin-bottom: 0.25em;
	letter-spacing: 0.1px;
	word-spacing: 0.7px;
}

.author {
	letter-spacing: 0.4px;
}

.q-mark {
	font-size: 2em;
	line-height: 0.55em;
	color: rgba(255,255,255,0.9);
}

.q-mark-top {
	position: relative;
	top: 0.2em;
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
