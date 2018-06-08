<template>
	<div class="grid" ref="grid" :class="{'dnd': dndEnabled}">
		<div class="grid-lines" v-if="dndEnabled">
			<div class="grid-lines-cell" v-for="box in (gridRows * gridCols)" :key="box"></div>
			<div class="grid-align hor" v-show="showHor"></div>
			<div class="grid-align ver" v-show="showVer"></div>
		</div>
		<WidgetFadeIn
			v-for="(widget, index) of widgets"
			:key="widget.name"
		>
		<div
			class="widget"
			:style="widgetGridPlacement[index]"
			v-if="isWidgetActive(widget.name)"
			:class="{'is-dragged': currentlyDragging.index === index}"
			@click="widgetClicked"
			:draggable="dndEnabled"
			@drag="dragging(widget.name, index, $event)"
			@dragend="dragEnd(widget.name, index, $event)"
			@dragstart="dragStart(widget.name, index, $event)"
		>
			<component			
				:is="componentFromName(widget.name)"				
				class="widget-inner"				
			/>
		</div>
		</WidgetFadeIn>
		<button v-if="dndEnabled" class="stop-dnd" @click="$store.commit('toggleDnd')">Klaar</button>
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
import {settingsOptions} from '@/store/defaultUserSettings';

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
			return settingsOptions.user.activeWidgets.canBeMoved;
		},
		widgets() {
			return this.$store.getters.activeWidgets;
		},
		widgetGridPlacement() {
			return this.widgets.map(val => {
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
		},
		dndEnabled() {
			return this.$store.getters.dndEnabled;
		}
	},
	methods: {
		componentFromName(name) {
			return `Start${name.charAt(0).toUpperCase()}${name.slice(1)}`;
		},
		isWidgetActive(name) {
			const canBeDisabled = settingsOptions.user.activeWidgets.canBeDisabled;

			if (canBeDisabled.includes(name)) {
				return this.widgets.find(w => w.name === name).active;
			} else return true;
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
				newCurrentlyDragging.initialRows = [...this.widgets[index].row];
				newCurrentlyDragging.initialCols = [...this.widgets[index].column];
			}
			
			this.currentlyDragging = {...newCurrentlyDragging};
			this.checkCenter(newCurrentlyDragging.initialCols, newCurrentlyDragging.initialRows);
		},
		dragStart(widgetName, index, e) {
			console.log(widgetName, index, e);
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

			this.$store.commit('setGridPosition', {index, row, col});
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
	align-items: stretch;
	justify-items: stretch;
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
	display: flex;
	justify-content: center;
}

.widget-inner {
	margin: auto;
}

.dnd .widget {
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

.stop-dnd {
	position: absolute;
	right: 5px;
	bottom: 5px;
	border: none!important;
}
</style>
