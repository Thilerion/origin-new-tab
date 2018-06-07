<template>
	<div class="widget-top-pages widget-no-select f-shadow-heavy">
			<div class="top-page-item" v-for="site in topSites" :key="site.title">
				<img :src="getFavicon(site.url)" height="32" width="32">
				<p class="top-page-title">{{site.title}}</p>
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
	box-shadow: 0px 0px 1px 3px white;
	display: inline-grid;
	width: 100%;
	height: 100%;
	max-height: 100%;
	justify-content: center;
	grid-template-columns: repeat(5, 8rem);
	grid-auto-rows: 1fr;
	grid-gap: 1rem 1rem;
}

.top-page-item {
	box-shadow: 0px 0px 1px 1px rgba(255,255,255,0.2);
	overflow: hidden;
	text-align: center;
}

.top-page-title {
	font-size: 1em;
	line-height: 1.1em;
}
</style>
