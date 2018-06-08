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
			:class="{'dnd': dndEnabled}"
			@click.native="widgetClicked"
			:draggable="dndEnabled"
			@drag.native="dragging(widget.name, index, $event)"
			@dragend.native="dragEnd(widget.name, index, $event)"
			@dragstart.native="dragStart(widget.name, index, $event)"
		/>
		</WidgetFadeIn>
		<button class="enable-dnd-btn" @click="enableDnD">DnD</button>
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

import {deepClone} from '@/utils/deepObject';

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
					column: [4, 8]
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
			],
			dndEnabled: true,
			currentlyDragging: {
				index: null,
				name: null,
				startRectX: null,
				startRectY: null,
				startX: null,
				startY: null,
				currentX: null,
				currentY: null,
				initialRows: [0, 0],
				initialCols: [0, 0],
				rowChange: 0,
				colChange: 0
			},
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight,
			gridCols: 10,
			gridRows: 20
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
		},
		rectXMoveDifference() {
			if (this.currentlyDragging.index == null) return 0;
			return this.currentlyDragging.currentX - this.currentlyDragging.startX;
		},
		rectYMoveDifference() {
			if (this.currentlyDragging.index == null) return 0;
			return this.currentlyDragging.currentY - this.currentlyDragging.startY;
		},
		gridColumnWidth() {
			return this.windowWidth / this.gridCols;
		},
		gridRowHeight() {
			return this.windowHeight / this.gridRows;
		},
		rowChange() {
			return this.currentlyDragging.rowChange;
		},
		colChange() {
			return this.currentlyDragging.colChange;
		}
	},
	methods: {
		isWidgetActive(name) {
			let widgetInActiveWidgets = this.activeWidgets.find(w => w.name === name);
			if (!widgetInActiveWidgets) return true;
			else return widgetInActiveWidgets.active;
		},
		enableDnD() {
			this.dndEnabled = !this.dndEnabled;
		},
		widgetClicked(e) {
			console.log(e);
			if (this.dndEnabled) {
				e.preventDefault();
				e.stopPropagation();
			}
		},
		setCurrentlyDragging(name = null, index = null, startRectX = null, startRectY = null, startX = null, startY = null) {
			const newCurrentlyDragging = {
				name,
				index,
				startRectX,
				startRectY,
				startX,
				startY,
				currentX: startX,
				currentY: startY,
				initialRows: [0, 0],
				initialCols: [0, 0],
				rowChange: 0,
				colChange: 0
			}
			if (index !== null) {
				newCurrentlyDragging.initialRows = [...this.grid[index].row];
				newCurrentlyDragging.initialCols = [...this.grid[index].column];
			}
			this.currentlyDragging = {...newCurrentlyDragging};
		},
		setDragPosition(currentX, currentY) {
			// console.log(deepClone(this.currentlyDragging));
			this.currentlyDragging = {...this.currentlyDragging, currentX, currentY};
			// console.log(deepClone(this.currentlyDragging));
		},
		dragStart(widgetName, index, e) {
			const rectCoords = e.currentTarget.getBoundingClientRect();
			const startX = e.clientX;
			const startY = e.clientY;
			this.setCurrentlyDragging(widgetName, index, rectCoords.x, rectCoords.y, startX, startY);
		},
		dragging(widgetName, index, e) {
			const coords = e.currentTarget.getBoundingClientRect();
			if (e.x === 0 && e.y === 0) return;
			this.setDragPosition(e.clientX, e.clientY);
			this.calcNewWidgetPosition();		
		},
		dragEnd(widgetName, index, e) {
			console.warn(`Stopped dragging ${widgetName}`);
			console.log(this.rectXMoveDifference, this.gridColumnWidth, Math.round(this.rectXMoveDifference / this.gridColumnWidth));
			this.calcNewWidgetPosition();
			this.setCurrentlyDragging();
		},
		setNewWidgetPosition(colChange, rowChange, index) {
			const colWidth = this.currentlyDragging.initialCols[1] - this.currentlyDragging.initialCols[0];
			const rowWidth = this.currentlyDragging.initialRows[1] - this.currentlyDragging.initialRows[0];

			let newColStart, newColEnd;



			if (colChange === 0) {
				newColStart = this.currentlyDragging.initialCols[0];
				newColEnd = this.currentlyDragging.initialCols[1];
			} else if (colChange < 0) {
				newColStart = Math.max(this.currentlyDragging.initialCols[0] + colChange, 1);
				newColEnd = newColStart + colWidth;
			} else if (colChange > 0) {
				newColEnd = Math.min(this.currentlyDragging.initialCols[1] + colChange, this.gridCols + 1);
				newColStart = newColEnd - colWidth;
			}
			

			const col = [newColStart, newColEnd];
			const row = [...this.currentlyDragging.initialRows].map(r => r + rowChange);

			this.grid[index].column = [...col];
			this.grid[index].row = [...row];
		},
		calcNewWidgetPosition() {
			const colChange = Math.round(this.rectXMoveDifference / this.gridColumnWidth);
			const rowChange = Math.round(this.rectYMoveDifference / this.gridRowHeight);
			const index = this.currentlyDragging.index;

			const [colStart, colEnd] = this.grid[index].column;
			const [rowStart, rowEnd] = this.grid[index].row;

			const maxColChange = (this.gridCols + 1 - colEnd);
			const minColChange = (1 - colStart);

			// let newColChange = 0;
			// if (colChange >= maxColChange) {
			// 	newColChange = maxColChange;
			// } else if (colChange <= minColChange) {
			// 	newColChange = minColChange;
			// } else {
			// 	newColChange = colChange;
			// }

			// const maxRowChange = (this.gridRows + 1 - rowEnd);
			// const minRowchange = (1 - rowStart);
			// let newRowChange = 0;
			// if (rowChange >= maxRowChange) {
			// 	newRowChange = maxRowChange;
			// } else if (rowChange <= minRowchange) {
			// 	newRowChange = minRowchange;
			// } else {
			// 	newRowChange = rowChange;
			// }
			
			let newColChange = colChange;
			let newRowChange = rowChange;

			console.log(newColChange, newRowChange);

			this.currentlyDragging.rowChange = newRowChange;
			this.currentlyDragging.colChange = newColChange;
		}
	},
	watch: {
		rowChange(newValue, oldValue) {
			if (this.currentlyDragging.index != null && newValue != null && newValue !== oldValue) {
				this.setNewWidgetPosition(this.currentlyDragging.colChange, this.currentlyDragging.rowChange, this.currentlyDragging.index);
			}
		},
		colChange(newValue, oldValue) {
			if (this.currentlyDragging.index != null && newValue != null && newValue !== oldValue) {
				this.setNewWidgetPosition(this.currentlyDragging.colChange, this.currentlyDragging.rowChange, this.currentlyDragging.index);
			}
		}
	}
}
</script>

<style>
.grid {
	--cols: 10;
	--rows: 20;
}

.grid {
	display: grid;
	grid-template-columns: repeat(var(--cols), 1fr);
	grid-template-rows: repeat(var(--rows), 1fr);
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

.widget {
	box-shadow: 0 0 5px 5px rgba(255,255,255,0.1);
	align-self: stretch!important;
	justify-self: stretch!important;
}

.widget.dnd {
	box-shadow: 0 0 5px 5px rgba(255,255,255,0.5);
	cursor:move!important;
}

.enable-dnd-btn {
	position: absolute;
	bottom: 0.25em;
	right: 3em;
}

.dnd * {
	cursor: move!important;
}
</style>
