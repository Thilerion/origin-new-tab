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

export default {
	components: {
		StartGreeting,
		StartWallpaperDetails
	},
	data() {
		return {
			grid:
			[
				{
					component: 'StartGreeting',
					row: [3, 5],
					column: [3, 9]
				},
				{
					component: 'StartWallpaperDetails',
					row: [6, 7],
					column: [1, 3]
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
	grid-template-columns: repeat(10, minmax(100px, 1fr));
	grid-template-rows: repeat(6, minmax(100px, 1fr));
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	align-items: center;
	justify-items: center;
}
</style>
