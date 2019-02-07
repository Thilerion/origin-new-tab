<template>
	<div class="grid" @dblclick="editing = !editing" :class="{editing}">
		<GridLines v-if="editing" />
		
		<BaseWidget
			:editing="editing"
			v-for="(widget, idx) in gridWidgets"
			:widget="widget"
			:key="`${widget.name}-${idx}`"
			:style="getWidgetGridPlacement(widget)">

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

export default {
	components: {
		GridLines,
		BaseWidget
	},
	data() {
		return {
			editing: false,
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
		}
	},
	created() {
		this.setGridColsRows(this.cols, this.rows);
	},
	mounted() {
		const el = this.$el;
		const style = window.getComputedStyle(el);
		const h = style.getPropertyValue('height');
		const w = style.getPropertyValue('width');
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
