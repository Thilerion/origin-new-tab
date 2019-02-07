<template>
	<div class="grid" @dblclick="toggleEditing" :class="{editing}" v-resize="onGridResize">
		<GridLines v-if="editing" />

		<div class="cell-measure" ref="gridCell" v-resize="onCellResize"></div>
		
		<BaseWidget
			:editing="editing"
			v-for="(widget, idx) in gridWidgets"
			:widget="widget"
			:key="`${widget.name}-${idx}`"
			:style="getWidgetGridPlacement(widget)"
			:selected="selectedWidget === idx"
			@click.native="toggleSelectWidget(widget, idx, $event)"
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

import {gridComponents} from '@/widgets';

const roundNumber = (num, digits = 2) => {
	const mult = 10 * digits;
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

			gridComponents
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
				// 'grid-row': `${widget.row.join(' / ')}`,
				// 'grid-column': `${widget.column.join(' / ')}`
				'grid-row-start': widget.y,
				'grid-column-start': widget.x,
				'grid-row-end': (widget.y + widget.height),
				'grid-column-end': (widget.x + widget.width)
			}
		},
		toggleSelectWidget(widget, idx, event) {
			if (this.editing && this.selectedWidget !== idx) {
				this.selectedWidget = idx;
			} else if (this.editing && this.selectedWidget === idx) {
				this.selectedWidget = null;
			}
		},
		toggleEditing() {
			this.editing = !this.editing;
			if (!this.editing) {
				this.selectedWidget = null;
			}
		},
		onCellResize(rect, el) {
			this.gridCellSize = {
				width: roundNumber(rect.width),
				height: roundNumber(rect.height)
			};
		},
		onGridResize(rect, el) {
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

	grid-template-columns: repeat(var(--cols), 1fr);
	grid-template-rows: repeat(var(--rows), 1fr);

	padding: .75rem .5rem;

	/* font-size, align-items, justify-items, gap */
}

.cell-measure {
	background: white;
	grid-row: 1 / 2;
	grid-column: 1 / 2;
	z-index: -100;
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
