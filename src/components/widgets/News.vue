<template>
	<div class="widget-news f-shadow-heavy" @mouseover="mouseOver = true" @mouseout="mouseOver = false">
		<div class="news-item-wrapper clip-edges f-shadow-heavy">
			<transition :name="transitionName">
				<a v-if="showItem != null" :href="shuffledArray[showItem].url" class="news-item" :key="showItem" target="_blank" rel="noopener" :class="{faster: fasterTransition}">{{shuffledArray[showItem].title}}</a>
			</transition>
		</div>	
		<button class="news-scroll-btn scroll-prev" @click="prev(true)">&lt;</button>	
		<button class="news-scroll-btn scroll-next" @click="next(true)">&gt;</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			showItem: null,
			shuffledArray: [],
			dir: null,
			mouseOver: false,
			timeout: null,
			fasterTransition: false
		}
	},
	computed: {
		news() {
			return this.$store.getters.newsArticles;
		},
		transitionName() {
			return `slide-news-${this.dir}`;
		}
	},
	methods: {
		next(faster) {
			this.fasterTransition = !!faster;
			this.$nextTick(() => {
				this.dir = 'next';
				this.showItem = (this.showItem + 1) % this.news.length
				this.restartTimeout();
			});			
		},
		prev(faster) {
			this.fasterTransition = !!faster;
			this.$nextTick(() => {
				this.dir = 'prev';
				if (this.showItem === 0) this.showItem = this.news.length - 1;
				else this.showItem -= 1;
				this.restartTimeout();
			});						
		},
		startTimeout() {
			let timeout = setTimeout(() => {
				const windowHasFocus = document.hasFocus();

				if (!windowHasFocus) {
					this.restartTimeout();
				} else if (this.mouseOver) {
					console.log("Not going to next news message: hovering.");
					this.restartTimeout();
				} else {
					this.next(false);
				}
			}, 6000);
			this.timeout = timeout;
		},
		restartTimeout() {
			clearTimeout(this.timeout);
			this.timeout = null;
			this.startTimeout();
		},
		stopTimeout() {
			clearTimeout(this.timeout);
			this.timeout = null;
		},
		loadRandomArticle() {
			const amount = this.news.length;
			this.showItem = Math.floor(Math.random() * amount);
			console.log("Random news item: ", this.showItem);
		},
		shuffleArray(arr) {
			let shuffled = [...arr];
			for (let i = shuffled.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}
			this.shuffledArray = [...shuffled];
		}
	},
	beforeMount() {
		this.shuffleArray(this.news);
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
	max-width: 45rem;
	position: relative;
	display: flex;
}

.widget-news.mouseover {
	color: green;
}

.news-item-wrapper {
	width: 100%;
	height: 2.5rem;
	position: relative;
	overflow: hidden;
	background: rgba(0,0,0,0.1);
}

.clip-edges {
	mask-image: linear-gradient(90deg, transparent 0rem, black 2rem, black calc(100% - 2rem), transparent calc(100% - 0rem));
}

.clip-edges > .news-item {
	padding-left: 2rem;
	padding-right: 2rem;
}

.news-item {
	text-align: center;
	display: inline-block;
	width: 100%;
	position: absolute;
	top: 0;
	line-height: 2.5rem;
	text-decoration: none;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.news-item:hover {
	text-decoration: underline;
}

.slide-news-next-enter-active, .slide-news-next-leave-active, .slide-news-prev-enter-active, .slide-news-prev-leave-active {
	transition-property: transform;
	transition-timing-function: ease-in-out;
	transition-duration: 2s;
}

.faster {
	transition-duration: 1s;
}

.slide-news-next-leave-to, .slide-news-prev-enter {
	transform: translateX(-100%);
}

.slide-news-next-enter, .slide-news-prev-leave-to {
	transform: translateX(100%);
}

.news-scroll-btn {
	background: none;
	border: none;
	color: inherit;
	text-shadow: inherit;
	position: absolute;
	font-size:1.5em;
	padding: 0;
	top: 0;
	bottom: 0;
	vertical-align: middle;
	line-height: 1em;
	min-width: 1rem;
}

.news-scroll-btn.scroll-prev {
	left: 0;
}

.news-scroll-btn.scroll-next {
	right: 0;
}
</style>
