<template>
	<div class="grid" @click="showGridLines = !showGridLines">
		<GridLines v-if="showGridLines" />
	</div>
</template>

<script>
import {mapState} from 'vuex';

import GridLines from './GridLines.vue'

export default {
	components: {
		GridLines
	},
	data() {
		return {
			showGridLines: true
		}
	},
	computed: {
		...mapState('grid', ['rows', 'cols'])
	},
	methods: {
		setGridColsRows(cols, rows) {
			const s = document.body.style;
			s.setProperty('--cols', cols);
			s.setProperty('--rows', rows);
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
		console.log(h, w)
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
</style>
