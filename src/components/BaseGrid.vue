<template>
<div class="grid-wrapper">
	<div
		class="grid"
		ref="grid"
		v-shortkey="['c']"
		@shortkey="toggleEditing"
		:class="{editing, dropzone: newWidgetOutline.show}"
		v-resize="onGridResize"
	>
		<GridLines v-if="editing" :showCenterGuides="showCenterGuides" />

		<div class="cell-measure" v-resize="onCellResize"></div>
		
		<BaseWidget
			:editing="editing"
			v-for="(widget, idx) in gridWidgets"
			:idx="idx"
			:widget="widget"
			:gridSize="gridSize"
			:cellSize="gridCellSize"
			:key="`${widget.name}-${idx}`"
			:style="getWidgetGridPlacement(widget, idx)"
			:selected="selectedWidget === idx"
			:config="displayConfigs[widget.name]"
			@selectWidget="toggleSelectWidget(widget.uid, $event)"
			@updateCenterGuides="updateCenterGuides"
			ref="widgets"
		>

			<transition name="widget-fade">
			<component
				class="widget"
				:is="gridComponents[widget.name]"
			/>
			</transition>

		</BaseWidget>

		<div
			class="widget-outline"
			v-if="newWidgetOutline.show"
			:style="widgetOutlinePlacement"
		><div class="outline-type">{{draggedWidget.type.slice(6)}}</div></div>

		<SettingsButton :style="settingsButtonGrid" />		
	</div>
	<transition name="slide">
		<GridEditingSidebar
			class="grid-sidebar"
			:selected="gridWidgets[selectedWidget]"
			v-if="editing"
			:sortedWidgets="sortedGridWidgets"
			@selectWidget="toggleSelectWidget"
		/>
	</transition>
</div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

import GridLines from './GridLines.vue';
import GridEditingSidebar from './grid-edit/GridEditingSidebar.vue';
import BaseWidget from './BaseWidget.vue';
import SettingsButton from './settings/SettingsButton.vue';

import DetectWidgetOverlap from '@/mixins/DetectWidgetOverlap.js';

import {gridComponents, displayConfigs} from '@/widgets';

const roundNumber = (num, digits = 2) => {
	const mult = 10 ** digits;
	return Math.round(num * mult) / mult;
}

//TODO: enable detect overlap

export default {
	mixins: [DetectWidgetOverlap],
	components: {
		GridLines,
		GridEditingSidebar,
		BaseWidget,
		SettingsButton
	},
	data() {
		return {
			selectedWidget: null,
			showCenterGuides: {
				x: false,
				y: false
			},
			newWidgetOutline: {
				show: false,
				x: null,
				y: null,
				width: null,
				height: null
			},

			gridSize: {
				x: null,
				y: null,
				width: null,
				height: null
			},
			gridCellSize: {
				width: null,
				height: null
			},

			gridComponents,
			displayConfigs
		}
	},
	computed: {
		...mapState({
			rows: state => state.grid.rows,
			cols: state => state.grid.cols,
			gridWidgets: state => state.grid.gridWidgets,
			gridOrder: state => state.grid.gridOrder,
			editing: state => state.editingGrid
		}),
		enableNewWidgetDropzone() {
			return this.$store.getters.enableNewWidgetDropzone;
		},
		sortedGridWidgets() {
			return this.gridOrder.map(uid => this.gridWidgets.find(w => w.uid === uid));
		},
		settingsButtonGrid() {
			return {
				'grid-row': `${this.rows} / span 1`,
				'grid-column': `${this.cols} / span 1`
			}
		},
		draggedWidget() {
			return this.$store.state.dragAddNewWidget;
		},
		widgetOutlinePlacement() {
			if (!this.newWidgetOutline.show) return {};

			const {x, y, width, height} = this.newWidgetOutline;
			return {
				'grid-row': `${y} / span ${height}`,
				'grid-column': `${x} / span ${width}`,
				'z-index': 100
			}
		}
	},
	methods: {
		setGridColsRows(cols, rows) {
			const s = document.body.style;
			s.setProperty('--cols', cols);
			s.setProperty('--rows', rows);
		},

		getWidgetGridPlacement(widget) {
			return {
				'grid-row': `${widget.y} / span ${widget.height}`,
				'grid-column': `${widget.x} / span ${widget.width}`,
				'z-index': this.gridOrder.indexOf(widget.uid)
			}
		},
		removeClickOutsideEvent() {
			document.removeEventListener('mouseup', this.clickOutsideDeselect);
		},
		clickOutsideDeselect(e) {
			let widgetWasClicked = false;
			console.log(this.$refs);
			for (const comp of this.$refs.widgets) {
				if (comp.$el === e.target || comp.$el.contains(e.target)) {
					widgetWasClicked = true;
					break;
				}
			}
			console.log(this.$refs);
			if (!widgetWasClicked && this.$refs.grid.contains(e.target)) {
				console.log("Clicked outside widget. Deselecting now.");
				this.deselectWidgets();
			} else if (!widgetWasClicked) {
				console.log("clicked outside but not in grid");
			}
		},
		deselectWidgets() {
			this.selectedWidget = null;
			this.disableCenterGuides();
			this.removeClickOutsideEvent();
		},
		toggleSelectWidget(uid, bool) {
			if (!this.editing || !bool || uid == null) {
				this.deselectWidgets();
			} else {
				if (this.selectedWidget == null) {
					document.addEventListener('mouseup', this.clickOutsideDeselect);
				}
				const idx = this.gridWidgets.findIndex(w => w.uid === uid);
				this.selectedWidget = idx;
			}
		},
		toggleEditing() {
			if (this.editing) {
				this.$store.commit('setEditingGrid', false);
				this.deselectWidgets();
			} else {
				this.$store.commit('setEditingGrid', true);
			}
		},
		updateCenterGuides({x, y}) {
			this.showCenterGuides = {x, y};
		},
		disableCenterGuides() {
			this.showCenterGuides = {x: false, y: false};
		},
		onCellResize(rect, el) {
			console.log("Cell resize triggered!");
			const w = roundNumber(rect.width);
			const h = roundNumber(rect.height);
			
			this.gridCellSize = {
				width: w,
				height: h
			}
		},
		onGridResize(rect, el) {
			console.log("Grid resize triggered!");
			this.gridSize = {
				x: rect.left,
				y: rect.top,
				width: roundNumber(rect.width),
				height: roundNumber(rect.height),
			}
		},
		initDropzone() {
			console.log("initiating dropzone");
			const grid = this.$refs.grid;
			grid.addEventListener('dragenter', this.onDragEnter);
			grid.addEventListener('dragover', this.onDragOver);
			grid.addEventListener('dragleave', this.onDragLeave);
			grid.addEventListener('drop', this.onDrop);
		},
		calculateGridPosition(x, y) {
			const colStart = Math.round(x / this.gridCellSize.width);
			const rowStart = Math.round(y / this.gridCellSize.height);

			let valX = colStart;
			let valY = rowStart;

			if (colStart < 1) {
				valX = 1;
			} else if (colStart > this.cols + 1) {
				valX = this.cols + 1;
			}
			if (rowStart < 1) {
				valY = 1;
			} else if (rowStart > this.rows + 1) {
				valY = this.rows + 1;
			}
			return {x: valX, y: valY};
		},
		onDragOver(e) {
			e.preventDefault();
			const clientX = e.clientX - this.draggedWidget.offsetX;
			const clientY = e.clientY - this.draggedWidget.offsetY;
			const {x, y} = this.calculateGridPosition(clientX, clientY);
			const valX = Math.min(x, (this.cols + 1) - this.draggedWidget.width);
			const valY = Math.min(y, (this.rows + 1) - this.draggedWidget.height);
			this.newWidgetOutline.x = valX;
			this.newWidgetOutline.y = valY;
		},
		onDragEnter(e) {
			e.preventDefault();
			console.log('drag enter');
			this.newWidgetOutline.show = true;
			this.onDragOver(e);
			this.newWidgetOutline.width = this.draggedWidget.width;
			this.newWidgetOutline.height = this.draggedWidget.height;
		},
		onDragLeave(e) {
			e.preventDefault();
			console.log('drag leave');
			this.newWidgetOutline.show = false;
		},
		onDrop(e) {
			console.log("Dropped widget!", e);
			const {x, y, width, height} = this.newWidgetOutline;
			const widgetType = this.draggedWidget.type;
			console.log({x, y, width, height, widgetType});
			this.$store.dispatch('addNewWidget', {x, y, width, height, widgetType}).then(uid => this.toggleSelectWidget(uid, true));
		},
		disableDropzone() {
			console.log("disabling dropzone");
			const grid = this.$refs.grid;
			grid.removeEventListener('dragenter', this.onDragEnter);
			grid.removeEventListener('dragover', this.onDragOver);
			grid.removeEventListener('dragleave', this.onDragLeave);
			grid.removeEventListener('drop', this.onDrop);
			this.newWidgetOutline = {
				show: false,
				x: null,
				y: null,
				width: null,
				height: null
			}
		}
	},
	watch: {
		enableNewWidgetDropzone(newValue, oldValue) {
			if (newValue && !oldValue) {
				console.log("Grid should enable dropzone");
				this.initDropzone();
			} else if (!newValue && oldValue) {
				console.log("Grid should DISABLE dropzone");
				this.disableDropzone();
			}
		}
	},
	created() {
		this.setGridColsRows(this.cols, this.rows);
	},
	beforeDestroy() {
		this.removeClickOutsideEvent();
		this.disableDropzone();
	}
}
</script>

<style scoped>
.grid-wrapper {
	display: flex;
	position: fixed;
	top: 0; bottom: 0;
	left: 0; right: 0;
	overflow: hidden;
}

.grid-sidebar {
	flex: 0 0 auto;
}

.slide-enter-active, .slide-leave-active {
	transition: width .2s ease;
}

.slide-enter, .slide-leave-to {
	width: 0;
}

.grid {
	flex: 1;
	display: grid;
	/* Minmax(0, 1fr) to prevent single-width/height items from increasing the size of the area
		note: The default for 1fr is minmax(auto, 1fr) */
	grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
	grid-template-rows: repeat(var(--rows), minmax(0, 1fr));

	padding: .75rem .5rem;
}

.grid.dropzone {
	/* background: rgba(95, 248, 248, 0.1); */
}

/* Needed to disable dragleave on child elements */
.grid.dropzone > * {
	pointer-events: none;
}

.widget-outline {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background: #e6e6ffcc;
	border: 4px solid yellow;
}

.cell-measure {
	grid-row: 1 / 2;
	grid-column: 1 / 2;
	z-index: -100;
	visibility: hidden;
}

.cell-measure.double {
	grid-row-end: 3;
	grid-column-end: 3;
}

.widget-fade-enter-active, .widget-fade-leave-active {
	transition: opacity .4s ease-out;
}

.widget-fade-enter, .widget-fade-leave-to {
	opacity: 0;
}
</style>

<style>
/* Fallback gridRows and gridCols */
:root {
	--cols: 10;
	--rows: 5;
}
</style>
