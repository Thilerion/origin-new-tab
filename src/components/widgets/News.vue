<template>
	<div class="widget-news f-shadow-heavy">
		<div class="news-item-wrapper clip-edges f-shadow-heavy">
			<transition :name="transitionName">
				<a :href="news[showItem].url" class="news-item" :key="showItem">{{news[showItem].title}}</a>
			</transition>
		</div>	
		<button class="news-scroll-btn scroll-prev" @click="prev">&lt;</button>	
		<button class="news-scroll-btn scroll-next" @click="next">&gt;</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			showItem: 0,
			dir: null
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
		next() {
			this.dir = 'next';
			this.showItem = (this.showItem + 1) % this.news.length
		},
		prev() {
			this.dir = 'prev';
			if (this.showItem === 0) this.showItem = this.news.length - 1;
			else this.showItem -= 1;
		}
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
	transition: transform 2s ease-in-out;
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
