<template>
	<div class="grid" ref="grid" :class="{'dnd': dndEnabled}" @dragover="dragOver">
		<div
			class="grid-lines"
			v-if="dndEnabled"
			:class="{
				'edge-left': showLeftLine,
				'edge-right': showRightLine,
				'edge-top': showTopLine,
				'edge-bottom': showBottomLine
			}"
		>
			<div class="grid-lines-cell" v-for="box in (gridRows * gridCols)" :key="box"></div>
			<div class="grid-align hor" v-show="showHor"></div>
			<div class="grid-align ver" v-show="showVer"></div>
		</div>

		<StartWidget
			class="widget"
			:style="widgetGridPlacement[index]"
			:widget="widget"
			:dndEnabled="dndEnabled"
			v-for="(widget, index) of activeWidgets"
			:key="widget.name"
		/>
		<button v-if="dndEnabled" class="stop-dnd" @click="toggleDnd">✓</button>
	</div>
</template>

<script>
import StartWidget from './widget-base/Widget.vue';

import {settingsOptions} from '@/store/libs/defaultUserSettings';
import {mapState, mapGetters, mapMutations} from 'vuex';

export default {
	components: {
		StartWidget
	},
	data() {
		return {
			gridCols: 0,
			gridRows: 0
		}
	},
	computed: {
		...mapGetters(['widgets']),
		...mapState(['dndEnabled']),
		widgetsInGrid() {
			return this.widgets.filter(w => settingsOptions.widgets.widgetOptions[w.name].grid);
		},
		activeWidgets() {
			return this.widgetsInGrid.filter(w => {
				const active = w.active;
				const canBeInactive = settingsOptions.widgets.widgetOptions[w.name].disable;
				return w.active || !canBeInactive;
			});
		},
		widgetGridPlacement() {
			return this.activeWidgets.map(val => {
				return {
					'grid-row-start': val.row[0],
					'grid-row-end': val.row[1],
					'grid-column-start': val.column[0],
					'grid-column-end': val.column[1]
				}
			})
		},
		showHor() {
			return this.$store.state.showHorizontalLine;
		},
		showVer() {
			return this.$store.state.showVerticalLine;
		},
		showEdgeLines() {
			return this.$store.state.showEdgeLines;
		},
		showLeftLine() {
			return this.showEdgeLines && this.showEdgeLines[3];
		},
		showRightLine() {
			return this.showEdgeLines && this.showEdgeLines[1];
		},
		showTopLine() {
			return this.showEdgeLines && this.showEdgeLines[0];
		},
		showBottomLine() {
			return this.showEdgeLines && this.showEdgeLines[2];
		}
	},
	methods: {
		...mapMutations(['toggleDnd', 'setGridSize']),
		getCSSGridVariables() {
			const el = this.$refs.grid;
			const gridCols = parseInt(getComputedStyle(el).getPropertyValue('--cols'));
			const gridRows = parseInt(getComputedStyle(el).getPropertyValue('--rows'));
			this.gridCols = gridCols;
			this.gridRows = gridRows;
			this.setGridSize({cols: gridCols, rows: gridRows});
		},
		dragOver(e) {
			// used to show the "move" icon when dnd is enabled and dragging
			if (this.dndEnabled)  {
				e.preventDefault();
				e.dataTransfer.dropEffect = "move";
			}
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
	font-size: 1em;
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

@media only screen and (max-width: 700px) {
	.grid:not(.dnd) {
		display: flex;
		max-width: 100%;
		flex-direction: column;
		justify-content: space-around;
	}
}

.grid-lines {
	--widget-align-colour-base: 0, 255, 179;
	--widget-align-colour: rgba(var(--widget-align-colour-base), 0.774);
	--widget-edge-colour: rgba(185, 43, 18, 0.884);
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

.grid-lines.edge-left {
	border-left: 4px solid var(--widget-edge-colour);
	left: -2px;
}
.grid-lines.edge-right {
	border-right: 4px solid var(--widget-edge-colour);
	right: -2px;
}
.grid-lines.edge-top {
	border-top: 4px solid var(--widget-edge-colour);
	top: -2px;
}
.grid-lines.edge-bottom {
	border-bottom: 4px solid var(--widget-edge-colour);
	bottom: -2px;
}

.grid-lines-cell {
	display: block;
	width: 100%;
	border: 1px solid rgba(200, 227, 255, 0.2);
}

.widget-no-select {
	user-select: none;
}

.grid-align {
	position: absolute;
	background: var(--widget-align-colour);
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
	width: 2.5rem;
	height: 1.5rem;
}
</style>
