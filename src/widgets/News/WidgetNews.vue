<template>
	<div class="widget-news" v-if="canShow">
		<div class="news-frame">
			<div class="scroll-btn-wrapper">
				<button @click="prevArticle(true)" class="icon-btn shadow-40"><IconArrowBack class="icon"/></button>
			</div>
			<div class="slider"
				@mouseover="mouseover = true"
				@mouseout="mouseover = false"
				:style="transitionDurationStyle"
			>
				<transition :name="transitionName">
					<a v-if="showItem != null"
						:href="articles[showItem].url"
						class="news-item shadow-10"
						:key="showItem"
						target="_blank"
						rel="noopener"
					>{{articles[showItem].title}}</a>
				</transition>				
			</div>
			<div class="scroll-btn-wrapper">
				<button @click="nextArticle(true)" class="icon-btn shadow-10"><IconArrowNext class="icon"/></button>
			</div>
		</div>
	</div>
</template>

<script>
import { register, persist } from './store.js';
import EnableWidgetStore from '@/mixins/EnableWidgetStore';

import IconArrowBack from '@/assets/icons/ui/md-arrow-prev.svg';
import IconArrowNext from '@/assets/icons/ui/md-arrow-next.svg';

export default {
	name: "WidgetNews",
	mixins: [EnableWidgetStore({
		namespace: 'news', register, persist
	})],
	components: {
		IconArrowBack,
		IconArrowNext
	},
	data() {
		return {
			showItem: null,
			slideDirection: 'left',
			mouseover: false,
			timeout: null,

			increasedSpeed: false,
			transitionDuration: 2000
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
			return Number(this.$store.state.settings.news.slideInterval);
		},
		transitionName() {
			return `slide-${this.slideDirection || 'left'}`
		},
		computedDuration() {
			if (this.increasedSpeed) {
				return 800;
			} else {
				return this.transitionDuration;
			}
		},
		transitionDurationStyle() {
			return {
				'--transition-duration': `${this.computedDuration}ms`
			}
		}
	},
	methods: {
		loadRandomArticle() {
			const n = this.articles.length;
			const rnd = Math.floor(Math.random() * n);
			this.showItem = rnd;
		},
		nextArticle(manual = false) {
			if (manual) this.increasedSpeed = true;
			else if (this.increasedSpeed) this.increasedSpeed = false;
			requestAnimationFrame(() => {
				this.showItem = (this.showItem + 1) % this.articles.length;
				this.restartTimeout();
			})			
		},
		prevArticle(manual = false) {
			if (manual) this.increasedSpeed = true;
			else if (this.increasedSpeed) this.increasedSpeed = false;
			requestAnimationFrame(() => {
				this.showItem = this.showItem === 0 ? this.articles.length - 1 : this.showItem - 1;
				this.restartTimeout();
			})
		},
		startTimeout() {
			if (this.slideInterval < 0) return;

			const delay = this.slideInterval + this.transitionDuration;

			this.timeout = setTimeout(() => {
				if (this.mouseover) {
					console.log("Hovering news item. Restarting timeout.");
					this.restartTimeout();
				} else if (document.visibilityState !== 'visible') {
					console.log("Page not visible. Restarting timeout.");
					this.restartTimeout();
				} else {
					this.nextArticle();
				}
			}, delay);
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
			const nArticles = this.articles.length - 1;

			if (oldValue === nArticles && newValue === 0) {
				this.slideDirection = 'left';
			} else if (oldValue === 0 && newValue === nArticles) {
				this.slideDirection = 'right';
			} else {
				this.slideDirection = oldValue < newValue ? 'left' : 'right';
			}
		},
		slideInterval(newValue, oldValue) {
			if (newValue < 0) {
				this.stopTimeout();
			} else if (newValue > 0 && newValue !== oldValue) {
				this.restartTimeout();
			}
		}
	},
	beforeMount() {
		this.loadRandomArticle();
		if (this.slideInterval >= 0) {
			this.startTimeout();
		}
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
	--bg: rgba(43, 43, 43, 0.2);
}

.news-frame {
	background: var(--bg);
	background: linear-gradient(to right, transparent, var(--bg) 2rem, var(--bg) calc(100% - 2rem), transparent 100%);
	padding: 0.25em 0;
	width: 100%;
	display: flex;
	
}

.slider {
	position: relative;
	width: 100%;
	overflow: hidden;
	height: 2em;
	mask-image: linear-gradient(90deg, transparent 0rem, black 2rem, black calc(100% - 2rem), transparent calc(100% - 0rem));
}

.news-item {
	/* Padding to prevent masking */
	padding: 0 1.25rem;

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

	will-change: transform, opacity;
}

.news-item:hover {
	text-decoration: underline;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
	transition: all var(--transition-duration) ease-in-out;
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

.scroll-btn-wrapper {
	width: 2em;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
