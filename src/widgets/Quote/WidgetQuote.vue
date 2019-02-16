<template>
	<div class="widget-quote shadow-40" v-if="canShow">
		<span class="quote">{{quote | removeDot}}</span>
		<span class="author">{{author}}</span>
	</div>
</template>

<script>
import { register, persist } from './store.js';
import EnableWidgetStore from '@/mixins/EnableWidgetStore';

export default {
	name: "WidgetQuote",
	mixins: [EnableWidgetStore({
		namespace: 'quote', register, persist
	})],
	components: {

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
	display: flex;
	flex-direction: column;
}

.quote {
	font-size: 1.25em;
	margin-bottom: 0.25em;
	letter-spacing: 0.1px;
	word-spacing: 0.7px;
	display: inline-block;
	padding-right: 0.25em;
}

.author {
	letter-spacing: 0.4px;
	margin-left: auto;
}
</style>
