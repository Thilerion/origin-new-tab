<template>
	<div class="widget-quote shadow-40" v-if="canShow" :key="quote">
		<span class="quote">“ {{quote | removeDot}} ”</span>
		<span class="author">~ {{author}}</span>
		<button @click="getNewQuote" class="reload-quote icon-btn"><IconSync class="icon small"/></button>
	</div>
</template>

<script>
import { register, persist } from './store.js';
import EnableWidgetStore from '@/mixins/EnableWidgetStore';

import IconSync from '@/assets/icons/ui/md-sync.svg';

export default {
	name: "WidgetQuote",
	mixins: [EnableWidgetStore({
		namespace: 'quote', register, persist
	})],
	components: {
		IconSync
	},
	data() {
		return {

		}
	},
	computed: {
		canShow() {
			return this.$store.getters['quote/showComponent'];
		},
		quote() {
			return this.$store.state.quote.data.quote;
		},
		author() {
			return this.$store.state.quote.data.author;
		}
	},
	methods: {
		getNewQuote() {
			this.$store.dispatch('quote/getNewQuote');
		}
	},
	filters: {
		removeDot(str = "") {
			if (str.endsWith('.')) {
				return str.slice(0, -1);
			} else return str;
		}
	},
}
</script>

<style scoped>
.widget-quote {
	text-align: center;
	display: grid;
	grid-template-areas: 
				"quote btn-reload"
				"author btn";
	grid-column-gap: 0.5em;
}

.quote {
	font-size: 1.25em;
	margin-bottom: 0.25em;
	letter-spacing: 0.1px;
	word-spacing: 0.7px;
	display: inline-block;
	padding-right: 0.25em;
	grid-area: quote;
}

.author {
	font-size: 0.9em;
	letter-spacing: 0.4px;
	margin-left: auto;
	opacity: 0.9;
	grid-area: author;
}

.reload-quote {
	flex: 0 0 1.5em;
	opacity: 0;
	transition: opacity .25s ease;
	grid-area: btn-reload;
	align-self: center;
}

.widget-quote:hover .reload-quote {
	opacity: 0.9;
}
</style>
