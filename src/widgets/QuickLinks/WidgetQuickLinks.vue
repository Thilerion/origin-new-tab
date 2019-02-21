<template>
	<div class="widget-quicklinks" :style="gridColumns">
		
		<a :href="site.url"
			rel="noreferrer"
			class="quicklink-item"
			v-for="(site, idx) in maxQuickLinks"
			:key="site.title">

			<img class="quicklink-icon"
				:src="favicons[idx]"
				height="32"
				width="32">
			<div class="quicklink-title shadow-40">{{site.title}}</div>

		</a>

	</div>
</template>

<script>
import getTopSites from '@/utils/chrome.topsites.js';
import getFavicon from '@/utils/chrome.favicon.js';

export default {
	name: "WidgetQuickLinks",
	data() {
		return {
			quickLinks: [],
			favicons: {}
		}
	},
	computed: {
		amountPerRow() {
			return this.$store.state.settings.quicklinks.amountPerRow;
		},
		gridColumns() {
			return {
				'grid-template-columns': `repeat(${this.amountPerRow}, 110px)`
			}
		},
		amount() {
			return this.$store.state.settings.quicklinks.amount;
		},
		maxQuickLinks() {
			return [...this.quickLinks].slice(0, this.amount);
		}
	},
	methods: {
		async getFavicon(url) {
			return await getFavicon(url);
		},
		async mapFavicons() {
			this.quickLinks.forEach((site, idx) => {
				const favicon = this.getFavicon(site.url).then(url => {
					this.$set(this.favicons, idx, url);
				})
			})
		}
	},
	created() {
		this.quickLinks = getTopSites();
		this.mapFavicons();
	}
}
</script>

<style scoped>
.widget-quicklinks {
	display: grid;
	grid-auto-rows: auto;
	grid-gap: 0.3em 0.1em;
}

.quicklink-item {
	padding: 0.5em 0.5em 0.5em;
	border-radius: 10px;
	text-decoration: none;
}

.quicklink-item:hover {
	text-decoration: underline;
	background-color: rgba(255, 255, 255, 0.15);
}

.quicklink-icon {
	display: block;
	margin: 0 auto 0.5em;
}

.quicklink-title {
	display: block;
	text-align: center;
	font-size: 0.8em;
	line-height: 1.3em;
	overflow: hidden;
	text-overflow: ellipsis;
	max-height: calc(1.3em * 2);
}
</style>
