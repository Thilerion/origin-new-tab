<template>
	<div class="widget-top-pages widget-no-select f-shadow-heavy">
			<a :href="site.url" rel="noreferrer" class="top-page-item" v-for="(site, index) in topSites" :key="site.title" @mousemove="setHoverGradient(index, $event)" ref="linkItem">
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
		},
		setHoverGradient(index, e) {
			const item = this.$refs.linkItem[index];
			
			const x = e.pageX - item.offsetLeft;
			const y = e.pageY - item.offsetTop;
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
.widget-top-pages {
	align-self: end;
	justify-self: center;
	display: inline-grid;
	width: 100%;
	max-width: calc(38em + (1em * 4));
	justify-content: center;
	align-items: center;
	grid-template-columns: repeat(5, minmax(6em, 1fr));
	grid-auto-rows: calc(32px + 1em + (2 * 1.25em));
	grid-gap: 0.5em 0.5em;
}

.top-page-item {
	position: relative;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: calc(32px + 1em + (2 * 1.25em));
	padding: 0.5em 0.25em;
	overflow: hidden;
	border-radius: 10px;
	text-decoration: none;
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
	background: radial-gradient(circle closest-side, rgba(255,255,255,0.2), rgba(255,255,255,0.01));
  	transform: translate(-50%, -50%);
 	transition: width 1s ease, height 1s ease, opacity 1s ease;
}

.top-page-item:hover::before {
	--size: 20em;
	opacity: 1;
	transition: width .2s ease, height .2s ease, opacity .2s ease;
}

.top-page-icon {
	filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.2));
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
