<template>
	<div
		class="widget-top-pages widget-no-select f-shadow-heavy"
		:style="dynamicRows"
	>
		<a
			:href="site.url"
			rel="noreferrer"
			class="top-page-item"
			v-for="(site, index) in topSitesSliced"
			:key="site.title"
			@mousemove="setHoverGradient(index, $event)"
			:style="{width: itemWidth + 'em'}"
			ref="linkItem">
			<img
				class="top-page-icon"
				:src="getFavicon(site.url)"
				height="32"
				width="32">
			<span
				class="top-page-title"
				ref="siteTitle"
			><span
				class="underline"
			>{{site.title}}</span></span>	
		</a>
	</div>
</template>

<script>
const DEFAULT_TOPSITES = [
	{
		title: "My startpage",
		url: "http://localhost:8080/"
	},
	{
		title: "reddit: the front page of the internet",
		url: "http://www.reddit.com/"
	},
	{
		title: "Blackboard – Blackboard Learn",
		url: "http://blackboard.leidenuniv.nl/webapps/portal/frameset.jsp"
	},
	{
		title: "Raindrop.io",
		url: "http://raindrop.io/"
	},
	{
		title: "Gmail",
		url: "http://gmail.com/"
	},
	{
		title: "(44) YouTube",
		url: "https://www.youtube.com/"
	},
	{
		title: "Google Drive",
		url: "https://drive.google.com/drive/"
	},
	{
		title: "Icons - Material Design",
		url: "https://material.io/icons/"
	},
	{
		title:
			"Albert Heijn: boodschappen online bestellen of bezoek onze winkels | AH.nl",
		url: "http://www.ah.nl/"
	},
	{
		title: "NU - Het laatste nieuws het eerst op NU.nl",
		url: "http://www.nu.nl/"
	}
];

import {mapGetters} from 'vuex';

export default {
	data() {
		return {
			topSites: [],
			failed: false,
			itemWidth: 8
		}
	},
	computed: {
		...mapGetters(['maxTopSites', 'topSiteColumns']),
		topSitesSliced() {
			return this.topSites.slice(0, this.maxTopSites);
		},
		dynamicRows() {
			const items = this.topSitesSliced.length;
			const columns = this.topSiteColumns;

			const widgetWidth = this.itemWidth * columns;

			const itemPadding = 1 * columns;

			return {
				'min-width': (widgetWidth + itemPadding) + 'em',
				'width': (widgetWidth + itemPadding) + 'em'
			}
		}
	},
	methods: {
		getTopSites() {
			try {
				let topSites = chrome.topSites.get((topSites) => {
					this.topSites = [...topSites];
					console.log(this.topSites);
				})
			} catch(e) {
				console.warn("could not retrieve topsites");
				this.topSites = [...DEFAULT_TOPSITES];
			}
		},
		getFavicon(url) {
			if (process.env.NODE_ENV === 'development') {
				return require('@/assets/logo.png');
			} else {				
				const domain = new URL(url);
				return `chrome://favicon/size/32/${domain.origin}`;
			}
		},
		setHoverGradient(index, e) {
			/* SOURCE
			https://github.com/atomiks/30-seconds-of-css/blob/master/snippets/mouse-cursor-gradient-tracking.md
			*/
			// debugger;
			const item = this.$refs.linkItem[index];

			const x = e.pageX - e.currentTarget.offsetLeft - e.currentTarget.offsetParent.offsetParent.offsetLeft;
			const y = e.pageY - e.currentTarget.offsetTop - e.currentTarget.offsetParent.offsetParent.offsetTop;

			item.style.setProperty('--x', `${x}px`);
			item.style.setProperty('--y', `${y}px`);
		}
	},
	created() {
		this.getTopSites();
	}
}
</script>

<style scoped>
.w-align-left {
	margin-right: auto;
	margin-left: -1em;
}

.w-align-center {
	margin-left: -1em;
}

.w-align-right {
	text-align: right;
	margin-left: auto;
}

.widget-top-pages {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: -0.75em;
}

.top-page-item {
	margin-left: 1em;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: calc(32px + 1.25em + (2 * 1.25em));
	padding: 0.5em 0.5em;
	overflow: hidden;
	border-radius: 10px;
	text-decoration: none;
	margin-bottom: 0.75em;
}

.top-page-item::before {
	--size: 5em;
	opacity: 0;
	content: "";
	position: absolute;
	left: var(--x);
	top: var(--y);
	width: var(--size);
	height: var(--size);
	background: radial-gradient(circle closest-side, rgba(255,255,255,0.25), rgba(255,255,255,0.01));
  	transform: translate(-50%, -50%);
 	transition: width 1s ease, height 1s ease, opacity 1s ease;
}

.top-page-item:hover::before {
	--size: 15em;
	opacity: 1;
	transition: width .2s ease, height .2s ease, opacity .2s ease;
}

.top-page-icon {
	filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.2));
	margin-bottom: 0.5em;
}

.top-page-title {	
	max-height: calc(2.5em + 2px);
	overflow: hidden;
	text-overflow: ellipsis;
	margin: auto;
	font-size: 0.875em;
	letter-spacing: 0.02em;
	line-height: 1.25em;
	position: relative;
	text-align: center;
	padding-bottom: 1px;
}

.underline {
	overflow: hidden;
	font-size: inherit;
	text-decoration: none;
	border-bottom: 1px solid rgba(255,255,255,0);
	transition: border-color .1s ease .05s;
}

.top-page-item:hover .underline {
	border-bottom: 1px solid rgba(255,255,255,1);
}
</style>
