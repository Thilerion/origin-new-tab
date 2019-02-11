<template>
	<div
		class="grid"
		v-shortkey="['c']"
		@shortkey="toggleEditing"
		:class="{editing}"
		v-resize="onGridResize"
	>
		<GridLines v-if="editing" />

		<div class="cell-measure" v-resize="onCellResize"></div>
		
		<BaseWidget
			:editing="editing"
			v-for="(widget, idx) in gridWidgets"
			:idx="idx"
			:widget="widget"
			:gridSize="gridSize"
			:cellSize="gridCellSize"
			:key="`${widget.name}-${idx}`"
			:style="getWidgetGridPlacement(widget)"
			:selected="selectedWidget === idx"
			:config="displayConfigs[widget.name]"
			@selectWidget="toggleSelectWidget(widget, idx, $event)"
			:ref="`baseWidget-${idx}`"
		>

			<component
				class="widget"
				:is="gridComponents[widget.name]"
			/>

		</BaseWidget>
		
	</div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';

import GridLines from './GridLines.vue';
import BaseWidget from './BaseWidget.vue';

import {gridComponents, displayConfigs} from '@/widgets';

const roundNumber = (num, digits = 2) => {
	const mult = 10 ** digits;
	return Math.round(num * mult) / mult;
}

export default {
	components: {
		GridLines,
		BaseWidget
	},
	data() {
		return {
			editing: false,
			selectedWidget: null,

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
			gridWidgets: state => state.grid.gridWidgets
		})
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
				'grid-column': `${widget.x} / span ${widget.width}`
			}
		},
		removeClickOutsideEvent() {
			document.removeEventListener('mouseup', this.clickOutsideDeselect);
		},
		clickOutsideDeselect(e) {
			let widgetWasClicked = false;
			for (const wComp in this.$refs) {
				const comp = this.$refs[wComp][0];
				if (comp.$el === e.target || comp.$el.contains(e.target)) {
					widgetWasClicked = true;
					break;
				}
			}
			if (!widgetWasClicked) {
				console.log("Clicked outside widget. Deselecting now.");
				this.deselectWidgets();
			}
		},
		deselectWidgets() {
			this.selectedWidget = null;
			this.removeClickOutsideEvent();
		},
		toggleSelectWidget(widget, idx, bool) {
			if (!this.editing || !bool || idx == null) {
				this.deselectWidgets();
			} else {
				if (this.selectedWidget == null) {
					document.addEventListener('mouseup', this.clickOutsideDeselect);
				}
				this.selectedWidget = idx;
			}
		},
		toggleEditing() {
			if (this.editing) {
				this.editing = false;
				this.deselectWidgets();
			} else {
				this.editing = true;
			}
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
		}
	},
	created() {
		this.setGridColsRows(this.cols, this.rows);
	},
	beforeDestroy() {
		this.removeClickOutsideEvent();
	}
}
</script>

<style scoped>
.grid {
	display: grid;
	position: fixed;
	top: 0; bottom: 0;
	left: 0; right: 0;
	overflow: hidden;
	/* Minmax(0, 1fr) to prevent single-width/height items from increasing the size of the area
		note: The default for 1fr is minmax(auto, 1fr) */
	grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
	grid-template-rows: repeat(var(--rows), minmax(0, 1fr));

	padding: .75rem .5rem;
}

.cell-measure {
	background: white;
	grid-row: 1 / 2;
	grid-column: 1 / 2;
	z-index: -100;
	visibility: hidden;
}

.cell-measure.double {
	grid-row-end: 3;
	grid-column-end: 3;
}
</style>

<style>
/* Fallback gridRows and gridCols */
:root {
	--cols: 10;
	--rows: 5;
}

.widget {
	user-select: none;
}

.editing .widget {
	
}
</style>
