<template>
	<div class="widget-news" v-if="canShow">
		<div class="news-wrapper"
			@mouseover="mouseover = true"
			@mouseout="mouseover = false"
		>
			<a v-if="showItem != null"
				:href="articles[showItem].url"
				class="news-item"
				:key="showItem"
				target="_blank"
				rel="noopener"
			>{{articles[showItem].title}}</a>
			
		</div>
	</div>
</template>

<script>
import { register, persist } from './store.js';

export default {
	name: "WidgetNews",
	data() {
		return {
			showItem: null,
			slideDirection: null,
			mouseover: false,
			timeout: null
		}
	},
	computed: {
		canShow() {
			return this.$store.getters['news/showComponent'];
		},
		articles() {
			return this.$store.state.news.data.articles;
		},
		slideInterval() {
			return this.$store.state.settings.news.slideInterval;
		}
	},
	methods: {
		loadRandomArticle() {
			const n = this.articles.length;
			const rnd = Math.floor(Math.random() * n);
			this.showItem = rnd;
		},
		nextArticle() {
			this.showItem = (this.showItem + 1) % this.articles.length;
			this.restartTimeout();
		},
		startTimeout() {
			this.timeout = setTimeout(() => {
				if (this.mouseover) {
					console.log("Hovering news item. Restarting timeout.");
					this.restartTimeout();
				} else {
					this.nextArticle();
				}
			}, this.slideInterval);
		},
		stopTimeout() {
			clearTimeout(this.timeout);
			this.timeout = null;
		},
		restartTimeout() {
			this.stopTimeout();
			this.startTimeout();
		}
	},
	beforeCreate() {
		register(this.$store);
		persist(this.$store);
		this.$store.dispatch('news/init');
	},
	beforeMount() {
		this.loadRandomArticle();
		this.startTimeout();
	},
	beforeDestroy() {
		this.stopTimeout();
	}
}
</script>

<style scoped>

</style>
