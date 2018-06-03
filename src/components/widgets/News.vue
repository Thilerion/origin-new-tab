<template>
	<div class="widget-news">
		<div class="news-item-wrapper clip-edges f-shadow-heavy">
			<transition :name="transitionName">
				<a :href="news[showItem].url" class="news-item" :key="showItem">{{news[showItem].title}}</a>
			</transition>
		</div>
		
		<button @click="prev">-</button>
		<button @click="next">+</button>
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
}

.news-item-wrapper {
	width: 100%;
	height: 1.5rem;
	position: relative;
	overflow: hidden;
}

.clip-edges {
	mask-image: linear-gradient(90deg, transparent 0px, black 2rem, black calc(100% - 2rem), transparent 100%);
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
	line-height: 1.5rem;
	text-decoration: none;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.news-item:hover {
	text-decoration: underline;
}

.slide-news-next-enter-active, .slide-news-next-leave-active {
	transition: transform 1s ease;
}

.slide-news-next-leave-to {
	transform: translateX(-100%);
}

.slide-news-next-enter {
	transform: translateX(100%);
}

.slide-news-prev-enter-active, .slide-news-prev-leave-active {
	transition: transform 1s ease;
}

.slide-news-prev-leave-to {
	transform: translateX(100%);
}

.slide-news-prev-enter {
	transform: translateX(-100%);
}
</style>
