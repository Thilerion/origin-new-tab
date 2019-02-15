<template>
<BaseFadeTransition type="fade">
	<div class="grid-lines">
		<div class="horizontal-wrapper">
			<div
				class="horizontal"
				v-for="row in rows"
				:key="row"
			></div>
		</div>
		<div class="vertical-wrapper">
			<div
				class="vertical"
				v-for="col in cols"
				:key="col"
			></div>
		</div>
		<div class="center-guide horizontal" :class="{show: showCenterGuides.x}"></div>
		<div class="center-guide vertical" :class="{show: showCenterGuides.y}"></div>
	</div>
</BaseFadeTransition>
</template>

<script>
import {mapState} from 'vuex';

export default {
	props: {
		showCenterGuides: {
			type: Object,
			default() {
				return {
					x: false,
					y: false
				}
			}
		}
	},
	computed: {
		...mapState({
			rows: state => state.grid.rows,
			cols: state => state.grid.cols
		})
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
	--center-guide-color: rgb(0, 225, 255);
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

.horizontal.center-guide {
	top: -20px;
	bottom: -20px;
	left: 0;
	right: 0;
	width: 2px;
	margin-left: auto;
	margin-right: auto;
	transform: translateX(1px);
}
.vertical.center-guide {
	top: 0;
	bottom: 0;
	left: -20px;
	right: -20px;
	height: 2px;
	margin-top: auto;
	margin-bottom: auto;
	transform: translateY(1px);
}
.center-guide {
	position: absolute;
	opacity: 0;
	background: var(--center-guide-color);
	mix-blend-mode: color-dodge;
	box-shadow: 0px 0px 0.5px 1px var(--center-guide-color);
	transition: opacity .2s ease;
}
.center-guide.show {
	opacity: 1;
}

.vertical:last-child {
	border-right-color: var(--ver-color); 
}
</style>
