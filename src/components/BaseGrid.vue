<template>
	<div class="grid">

	</div>
</template>

<script>
import {mapState} from 'vuex';

export default {
	data() {
		return {

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
