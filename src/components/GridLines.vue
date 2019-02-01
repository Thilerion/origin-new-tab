<template>
	<div class="grid-lines">
		<div class="horizontal-wrapper">
			<div class="horizontal" v-for="row in rows" :key="row"></div>
		</div>
		<div class="vertical-wrapper">
			<div class="vertical" v-for="col in cols" :key="col"></div>
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex';

export default {
	computed: {
		...mapState('grid', ['rows', 'cols'])
	}
}
</script>

<style scoped>
.grid-lines {
	grid-column: 1 / -1;
	grid-row: 1 / -1;
	background: rgba(255, 255, 255, 0.1);
	position: relative;
	pointer-events: none;

	--hor-color: hsla(0, 50%, 80%, 0.5);
	--ver-color: hsla(240, 50%, 80%, 0.5);
}

.horizontal-wrapper, .vertical-wrapper {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;	
	display: flex;
}

.horizontal-wrapper {
	flex-direction: column;
}

.vertical-wrapper {
	flex-direction: row;
}

.horizontal {
	width: 100%;
	border: 1px solid transparent;
	border-top-color: var(--hor-color);
	flex: 1;
}

.horizontal:last-child {
	border-bottom-color: var(--hor-color);
}

.vertical {
	height: 100%;
	border: 1px solid transparent;
	border-left-color: var(--ver-color);
	flex: 1;
}

.vertical:last-child {
	border-right-color: var(--ver-color); 
}
</style>
