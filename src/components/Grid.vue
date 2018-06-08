<template>
	<div class="grid" ref="grid">
		<WidgetFadeIn
			v-for="(widget, index) of grid"
			:key="widget.name"
		>
		<component			
			:is="widget.component"
			:style="widgetGridPlacement[index]"
			class="widget"
			v-if="isWidgetActive(widget.name)"
			:class="{'dnd': dndEnabled, 'is-dragged': currentlyDragging.index === index}"
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
					row: [8, 13],
					column: [14, 28]
				},
				{
					component: 'StartWallpaperDetails',
					name: 'wallpaperDetails',
					row: [19, 21],
					column: [1, 12]
				},
				{
					component: 'StartQuote',
					name: 'quote',
					row: [3, 5],
					column: [14, 28]
				},
				{
					component: 'StartWeather',
					name: 'weather',
					row: [1, 6],
					column: [37, 41]
				},
				{
					component: 'StartNews',
					name: 'news',
					row: [1, 3],
					column: [14, 28]
				},
				{
					component: 'StartSettingsButton',
					name: 'settingsButton',
					row: [20, 21],
					column: [40, 41]
				},
				{
					component: 'StartTopPages',
					name: 'topPages',
					row: [15, 20],
					column: [12, 30]
				}
			],
			dndEnabled: false,
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
			gridCols: 0,
			gridRows: 0
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
			if (!this.dndEnabled) return;

			const rectCoords = e.currentTarget.getBoundingClientRect();
			const startX = e.clientX;
			const startY = e.clientY;
			this.setCurrentlyDragging(widgetName, index, rectCoords.x, rectCoords.y, startX, startY);
		},
		dragging(widgetName, index, e) {
			if (!this.dndEnabled) return;
			
			const coords = e.currentTarget.getBoundingClientRect();
			if (e.x === 0 && e.y === 0) return;
			this.setDragPosition(e.clientX, e.clientY);
			this.calcNewWidgetPosition();		
		},
		dragEnd(widgetName, index, e) {
			if (!this.dndEnabled) return;

			console.warn(`Stopped dragging ${widgetName}`);
			console.log(this.rectXMoveDifference, this.gridColumnWidth, Math.round(this.rectXMoveDifference / this.gridColumnWidth));
			this.calcNewWidgetPosition();
			this.setCurrentlyDragging();
		},
		setNewWidgetPosition(colChange, rowChange, index) {
			const colWidth = this.currentlyDragging.initialCols[1] - this.currentlyDragging.initialCols[0];
			const rowHeight = this.currentlyDragging.initialRows[1] - this.currentlyDragging.initialRows[0];

			let newColStart, newColEnd, newRowStart, newRowEnd;



			if (colChange === 0) {
				newColStart = this.currentlyDragging.initialCols[0];
				newColEnd = this.currentlyDragging.initialCols[1];
			} else if (colChange < 0) {
				newColStart = Math.max(this.currentlyDragging.initialCols[0] + colChange, 1);
				newColEnd = newColStart + colWidth;
			} else if (colChange > 0) {
				newColEnd = Math.min(this.currentlyDragging.initialCols[1] + colChange, (this.gridCols + 1));
				newColStart = newColEnd - colWidth;
			}

			if (rowChange === 0) {
				newRowStart = this.currentlyDragging.initialRows[0];
				newRowEnd = this.currentlyDragging.initialRows[1];
			} else if (rowChange < 0) {
				newRowStart = Math.max(this.currentlyDragging.initialRows[0] + rowChange, 1);
				newRowEnd = newRowStart + rowHeight;
			} else if (rowChange > 0) {
				newRowEnd = Math.min(this.currentlyDragging.initialRows[1] + rowChange, this.gridRows + 1);
				newRowStart = newRowEnd - rowHeight;
			}			

			const col = [newColStart, newColEnd];
			const row = [newRowStart, newRowEnd];

			this.grid[index].column = [...col];
			this.grid[index].row = [...row];
		},
		calcNewWidgetPosition() {
			const colChange = Math.round(this.rectXMoveDifference / this.gridColumnWidth);
			const rowChange = Math.round(this.rectYMoveDifference / this.gridRowHeight);
			const index = this.currentlyDragging.index;

			this.currentlyDragging.rowChange = rowChange;
			this.currentlyDragging.colChange = colChange;
		},
		getCSSGridVariables() {
			const el = this.$refs.grid;
			this.gridCols = parseInt(getComputedStyle(el).getPropertyValue('--cols'));
			this.gridRows = parseInt(getComputedStyle(el).getPropertyValue('--rows'));
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
	},
	beforeMount() {
		setTimeout(() => {
			this.getCSSGridVariables();
		}, 0);
	}
}
</script>

<style>
.grid {
	--cols: 40;
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
}

.widget-no-select {
	user-select: none;
}

.widget {
	box-shadow: 0 0 5px 5px rgba(255,255,255,0.1);
	position: relative;
}

.widget.dnd {
	box-shadow: 0 0 5px 5px rgba(255,255,255,0.5);
	cursor:move!important;
}

.widget::before {
	visibility: hidden;
	content: "";
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: transparent;
	transition: visibility 0.5s ease, background-color 0.5s ease;
}

.is-dragged.widget::before {
	visibility: visible;
	background-color: rgba(50, 100, 200, 0.4);
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
