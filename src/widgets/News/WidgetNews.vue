<template>
	<div class="widget-news" v-if="canShow">
		<div class="news-frame">
			<button @click="prevArticle">&lt;</button>
			<div class="slider"
				@mouseover="mouseover = true"
				@mouseout="mouseover = false"
			>
				<transition :name="transitionName">
					<a v-if="showItem != null"
						:href="articles[showItem].url"
						class="news-item"
						:key="showItem"
						target="_blank"
						rel="noopener"
					>{{articles[showItem].title}}</a>
				</transition>				
			</div>
			<button @click="nextArticle">&gt;</button>
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
			slideDirection: 'left',
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
		},
		transitionName() {
			return `slide-${this.slideDirection || 'left'}`
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
		prevArticle() {
			this.showItem = this.showItem === 0 ? this.articles.length - 1 : this.showItem - 1;
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
	watch: {
		showItem(newValue, oldValue) {
			if (oldValue == null) {
				return;
			}
			if ((newValue < oldValue && !(newValue === 0 && oldValue === this.articles.length - 1)) || (oldValue === 0 && newValue === this.articles.length - 1)) {
				this.slideDirection = 'right';
			} else {
				this.slideDirection = 'left';
			}
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
.widget-news {
	width: 100%;
	height: 100%;
}

.news-frame {
	background: black;
	padding: 0.75em 0;
	width: 100%;

	display: flex;
}

.slider {
	position: relative;
	width: 100%;
	overflow: hidden;
	height: 2em;
}

.news-item {
	display: inline-block;
	width: 100%;
	position: absolute;
	top: 0;
	text-align: center;
	text-decoration: none;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	line-height: 2em;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
	transition: all 1.2s ease-in-out;
	transition-property: transform opacity;
}

.slide-left-enter,
.slide-right-leave-to {
	transform: translateX(100%);
	opacity: 0.3;
}

.slide-left-leave-to,
.slide-right-enter {
	transform: translateX(-100%);
	opacity: 0.3;
}
</style>
