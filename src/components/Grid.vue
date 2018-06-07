<template>
	<div class="grid">
		<WidgetFadeIn
			v-for="(widget, index) of grid"
			:key="widget.name"
		>
		<component			
			:is="widget.component"
			:style="widgetGridPlacement[index]"
			class="widget"
			v-if="isWidgetActive(widget.name)"
		/>
		</WidgetFadeIn>
	</div>
</template>

<script>
import StartGreeting from "./widgets/Greeting.vue";
import StartWallpaperDetails from './widgets/WallpaperDetails.vue';
import StartQuote from './widgets/Quote.vue';
import StartWeather from './widgets/Weather.vue';
import StartNews from './widgets/News.vue';
import StartSettingsButton from './SettingsButton.vue';
import StartTopPages from './widgets/TopPages.vue';

export default {
	components: {
		StartGreeting,
		StartWallpaperDetails,
		StartQuote,
		StartWeather,
		StartNews,
		StartSettingsButton,
		StartTopPages
	},
	data() {
		return {
			grid:
			[
				{
					component: 'StartGreeting',
					name: 'greeting',
					row: [7, 14],
					column: [1, 13]
				},
				{
					component: 'StartWallpaperDetails',
					name: 'wallpaperDetails',
					row: [19, 21],
					column: [1, 5]
				},
				{
					component: 'StartQuote',
					name: 'quote',
					row: [3, 5],
					column: [3, 9]
				},
				{
					component: 'StartWeather',
					name: 'weather',
					row: [1, 6],
					column: [9, 11]
				},
				{
					component: 'StartNews',
					name: 'news',
					row: [1, 3],
					column: [3, 9]
				},
				{
					component: 'StartSettingsButton',
					name: 'settingsButton',
					row: [20, 21],
					column: [10, 11]
				},
				{
					component: 'StartTopPages',
					name: 'topPages',
					row: [15, 20],
					column: [3, 9]
				}
			]
		}
	},
	computed: {
		widgetNames() {
			return this.grid.map(val => val.component);
		},
		activeWidgets() {
			return this.$store.getters.activeWidgets;
		},
		widgetGridPlacement() {
			return this.grid.map(val => {
				return {
					'grid-row-start': val.row[0],
					'grid-row-end': val.row[1],
					'grid-column-start': val.column[0],
					'grid-column-end': val.column[1]
				}
			})
		}
	},
	methods: {
		isWidgetActive(name) {
			let widgetInActiveWidgets = this.activeWidgets.find(w => w.name === name);
			if (!widgetInActiveWidgets) return true;
			else return widgetInActiveWidgets.active;
		}
	}
}
</script>

<style>
.grid {
	display: grid;
	grid-template-columns: repeat(10, 1fr);
	grid-template-rows: repeat(20, 1fr);
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	align-items: center;
	justify-items: center;
	padding: .75em .5em;
	grid-row-gap: 1rem;
}

.widget-no-select {
	user-select: none;
}
</style>
