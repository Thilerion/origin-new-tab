<template>
	<div class="grid" ref="grid" :class="{'dnd': dndEnabled}">
		<div class="grid-lines" v-if="dndEnabled">
			<div class="grid-lines-cell" v-for="box in (gridRows * gridCols)" :key="box"></div>
			<div class="grid-align hor" v-show="showHor"></div>
			<div class="grid-align ver" v-show="showVer"></div>
		</div>
		<WidgetFadeIn
			v-for="(widget, index) of grid"
			:key="widget.name"
		>
		<component			
			:is="widget.component"
			:style="widgetGridPlacement[index]"
			class="widget"
			v-if="isWidgetActive(widget.name)"
			:class="{'is-dragged': currentlyDragging.index === index}"
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
					row: [8, 14],
					column: [11, 31]
				},
				{
					component: 'StartWallpaperDetails',
					name: 'wallpaperDetails',
					row: [19, 21],
					column: [1, 13]
				},
				{
					component: 'StartQuote',
					name: 'quote',
					row: [3, 5],
					column: [11, 31]
				},
				{
					component: 'StartWeather',
					name: 'weather',
					row: [1, 6],
					column: [35, 41]
				},
				{
					component: 'StartNews',
					name: 'news',
					row: [1, 3],
					column: [11, 31]
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
					row: [14, 20],
					column: [11, 31]
				}
			],
			dndEnabled: false,
			currentlyDragging: {
				index: null,
				startX: null,
				startY: null,
				currentX: null,
				currentY: null,
				initialRows: [0, 0],
				initialCols: [0, 0],
				rowChange: 0,
				colChange: 0,
				isCenterVertical: false,
				isCenterHorizontal: false
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
		},
		showHor() {
			return this.currentlyDragging.isCenterHorizontal;
		},
		showVer() {
			return this.currentlyDragging.isCenterVertical;
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
		setCurrentlyDragging(index = null, startX = null, startY = null) {
			const newCurrentlyDragging = {
				index,
				startX,
				startY,
				currentX: startX,
				currentY: startY,
				initialRows: [0, 0],
				initialCols: [0, 0],
				rowChange: 0,
				colChange: 0,
				isCenterVertical: false,
				isCenterHorizontal: false
			}
			if (index !== null) {
				newCurrentlyDragging.initialRows = [...this.grid[index].row];
				newCurrentlyDragging.initialCols = [...this.grid[index].column];
			}
			
			this.currentlyDragging = {...newCurrentlyDragging};
			this.checkCenter(newCurrentlyDragging.initialCols, newCurrentlyDragging.initialRows);
		},
		dragStart(widgetName, index, e) {
			if (!this.dndEnabled) return;

			const startX = e.clientX;
			const startY = e.clientY;

			let el = document.createElement('div');
			e.dataTransfer.setDragImage(el, 0, 0);			

			this.setCurrentlyDragging(index, startX, startY);
		},
		dragging(widgetName, index, e) {
			if (!this.dndEnabled) return;
			
			if (e.x === 0 && e.y === 0) return;
			this.currentlyDragging = {...this.currentlyDragging, currentX: e.clientX, currentY: e.clientY};
			this.calcNewWidgetPosition();		
		},
		dragEnd(widgetName, index, e) {
			if (!this.dndEnabled) return;

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

			this.checkCenter(col, row);

			this.grid[index].column = [...col];
			this.grid[index].row = [...row];
		},
		calcNewWidgetPosition() {
			const colChange = Math.round(this.rectXMoveDifference / this.gridColumnWidth);
			const rowChange = Math.round(this.rectYMoveDifference / this.gridRowHeight);

			this.currentlyDragging.rowChange = rowChange;
			this.currentlyDragging.colChange = colChange;
		},
		checkCenter(widgetCols, widgetRows) {
			let cols = this.gridCols;
			let rows = this.gridRows;

			let fromLeft = widgetCols[0] - 1;
			let toRight = (cols + 1) - widgetCols[1];
			let horizontal = fromLeft === toRight;

			let fromTop = widgetRows[0] - 1;
			let toBottom = (rows + 1) - widgetRows[1];
			let vertical = fromTop === toBottom;

			console.log(horizontal, vertical);
			this.currentlyDragging.isCenterVertical = vertical;
			this.currentlyDragging.isCenterHorizontal = horizontal;
		},
		getCSSGridVariables() {
			const el = this.$refs.grid;
			this.gridCols = parseInt(getComputedStyle(el).getPropertyValue('--cols'));
			this.gridRows = parseInt(getComputedStyle(el).getPropertyValue('--rows'));
		},
		rowOrColChanged(newValue, oldValue) {
			if (this.currentlyDragging.index != null && newValue != null && newValue !== oldValue) {
				this.setNewWidgetPosition(this.currentlyDragging.colChange, this.currentlyDragging.rowChange, this.currentlyDragging.index);
			}
		}
	},
	watch: {
		rowChange(newValue, oldValue) {
			this.rowOrColChanged(newValue, oldValue);
		},
		colChange(newValue, oldValue) {
			this.rowOrColChanged(newValue, oldValue);
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
	grid-row-gap: 0.5rem;
}

.grid-lines {
	display: grid;
	grid-template-columns: repeat(var(--cols), 1fr);
	grid-template-rows: repeat(var(--rows), 1fr);
	justify-items: stretch;
	position: absolute;
	top: 0; right: 0; bottom: 0; left: 0;
	margin: calc(.75em - 3px) calc(.5em - 3px);
	border: 2px solid rgba(200, 227, 255, 0.2);
}

.grid-lines-cell {
	display: block;
	width: 100%;
	border: 1px solid rgba(200, 227, 255, 0.2);
}

.widget-no-select {
	user-select: none;
}

.widget {
	position: relative;
}

.dnd .widget {
	position: relative;
	box-shadow: 0 0 2px 5px rgba(255,255,255,0.3);
	transition: box-shadow .2s ease, background-color .5s ease;
	cursor:move!important;
}

.dnd .widget:hover {
	box-shadow: 0 0 5px 5px rgba(60, 154, 255, 0.904);
	background-color: rgba(50, 100, 200, 0.1);
}

.dnd .is-dragged.widget {
	background-color: rgba(50, 100, 200, 0.6);
	opacity: 1;
}

.enable-dnd-btn {
	position: absolute;
	bottom: 0.25em;
	right: 3em;
}

.dnd .widget * {
	cursor: move!important;
}

.grid-align {
	position: absolute;
	background: rgba(0, 255, 179, 0.774);
}

.grid-align.hor {
	width: 4px;
	height: 100%;
	top: 0;
	left: calc(50% - 2px);
}

.grid-align.ver {
	height: 4px;
	width: 100%;
	left: 0;
	top: calc(50% - 2px);
}
</style>
