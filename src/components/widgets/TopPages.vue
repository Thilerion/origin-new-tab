<template>
	<div class="widget-top-pages widget-no-select f-shadow-heavy">
			<div class="top-page-item" v-for="site in topSites" :key="site.title">
				<img :src="getFavicon(site.url)" height="32" width="32">
				<p class="top-page-title" ref="siteTitle">{{site.title}}</p>		
			</div>
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

export default {
	data() {
		return {
			topSites: [],
			failed: false
		}
	},
	computed: {
		topSitesLength() {
			return this.topSites.length;
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
				return `chrome://favicon/size/48/${domain.origin}`;
			}
		}
	},
	created() {
		this.getTopSites();
	}
}
</script>

<style scoped>
.widget-top-pages {
	align-self: end;
	display: inline-grid;
	width: 100%;
	max-height: 100%;
	justify-content: center;
	align-items: center;
	grid-template-columns: repeat(5, 1fr);
	grid-auto-rows: calc(32px + (2 * 1.25em));
	grid-gap: 1rem 1rem;
}

.top-page-item {
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: calc(32px + (2 * 1.25em));
	overflow: hidden;
}

.top-page-title {
	max-height: 2.5em;
	overflow: hidden;
	margin: auto;
	font-size: 0.875em;
	letter-spacing: 0.02em;
	line-height: 1.25em;
}
</style>
