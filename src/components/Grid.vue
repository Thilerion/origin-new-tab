<template>
	<div class="grid">
		<component
			v-for="(widget, index) of widgetNames"
			:key="widget"
			:is="widget"
			:style="widgetGridPlacement[index]"
		/>
	</div>
</template>

<script>
import StartGreeting from "./widgets/Greeting.vue";
import StartWallpaperDetails from './widgets/WallpaperDetails.vue';
import StartQuote from './widgets/Quote.vue';
import StartWeather from './widgets/Weather.vue';

export default {
	components: {
		StartGreeting,
		StartWallpaperDetails,
		StartQuote,
		StartWeather
	},
	data() {
		return {
			grid:
			[
				{
					component: 'StartGreeting',
					row: [7, 13],
					column: [1, 13]
				},
				{
					component: 'StartWallpaperDetails',
					row: [19, 21],
					column: [1, 5]
				},
				{
					component: 'StartQuote',
					row: [2, 4],
					column: [3, 9]
				},
				{
					component: 'StartWeather',
					row: [1, 6],
					column: [9, 11]
				}
			]
		}
	},
	computed: {
		widgetNames() {
			return this.grid.map(val => val.component);
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
	padding: .5em;
}
</style>
