<template>
	<div class="widget-top-pages widget-no-select f-shadow-heavy">
			<a :href="site.url" rel="noreferrer" class="top-page-item" v-for="site in topSites" :key="site.title">
				<img class="top-page-icon" :src="getFavicon(site.url)" height="32" width="32">
				<span class="top-page-title" ref="siteTitle"><span class="underline">{{site.title}}</span></span>	
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
	justify-self: center;
	display: inline-grid;
	width: 100%;
	max-width: calc(38em + (1em * 4));
	justify-content: center;
	align-items: center;
	grid-template-columns: repeat(5, minmax(5.5em, 1fr));
	grid-auto-rows: calc(32px + 1em + (2 * 1.25em));
	grid-gap: 0.5em 0.75em;
}

.top-page-item {
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: calc(32px + 1em + (2 * 1.25em));
	padding: 0.5em 0.25em;
	overflow: hidden;
	border-radius: 10px;
	/* background-image: linear-gradient(200deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1)20%); */
	background: linear-gradient(15deg,	rgba(255,255,255,0.0) 50%,
										rgba(255,255,255,0.4) 100%);
	background-position: 100% 100%;
	background-size: 300% 300%;
	transition: background-position .3s ease;
	text-decoration: none;
}

.top-page-item:hover {
	background-position: 100% 40%;	
}

.top-page-icon {
	filter:drop-shadow(1px 1px 2px rgba(0,0,0,0.2));
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
}

.underline {
	overflow: hidden;
	font-size: inherit;
	background-image: linear-gradient(to bottom, white 0%, white 100%);
	background-repeat: no-repeat;
	background-size: 100%;
	background-position: 0 calc(1.25em);
	transition: background-position 0s linear 0s;
}

.top-page-item:hover .underline {
	transition: background-position 0s linear .1s;
	background-position: 0 calc(1.25em - 2px);
}
</style>
