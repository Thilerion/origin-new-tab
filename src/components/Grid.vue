<template>
	<div class="grid" ref="grid" :class="{'dnd': dndEnabled}" @dragover="dragOver">
		<div class="grid-lines" v-if="dndEnabled">
			<div class="grid-lines-cell" v-for="box in (gridRows * gridCols)" :key="box"></div>
			<div class="grid-align hor" v-show="showHor"></div>
			<div class="grid-align ver" v-show="showVer"></div>
		</div>

		<WidgetFadeIn
			v-for="(widget, index) of activeWidgets"
			:key="widget.name"
		>
			<StartWidget
				class="widget"
				:style="widgetGridPlacement[index]"
				:widget="widget"
				:dndEnabled="dndEnabled"
			/>
		</WidgetFadeIn>
		<button v-if="dndEnabled" class="stop-dnd" @click="toggleDnd">✓</button>
	</div>
</template>

<script>
import StartWidget from './widget-base/Widget.vue';

import {deepClone} from '@/utils/deepObject';
import {settingsOptions} from '@/store/defaultUserSettings';
import {mapState, mapMutations} from 'vuex';

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
		...mapState('settings', {
			widgets: state => state.settingsData.widgets
		}),
		...mapState('settings', ['dndEnabled']),
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
		draggableWidgets() {
			return this.activeWidgets.filter(w => {
				return settingsOptions.widgets.widgetOptions[w.name].move;
			})
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
			//return this.currentlyDragging.isCenterHorizontal;
		},
		showVer() {
			//return this.currentlyDragging.isCenterVertical;
		}
	},
	methods: {
		...mapMutations('settings', ['toggleDnd', 'setGridSize']),
		checkCenter(widgetCols, widgetRows) {
			/*let cols = this.gridCols;
			let rows = this.gridRows;

			let fromLeft = widgetCols[0] - 1;
			let toRight = (cols + 1) - widgetCols[1];
			let horizontal = fromLeft === toRight;

			let fromTop = widgetRows[0] - 1;
			let toBottom = (rows + 1) - widgetRows[1];
			let vertical = fromTop === toBottom;

			console.log(horizontal, vertical);
			this.currentlyDragging.isCenterVertical = vertical;
			this.currentlyDragging.isCenterHorizontal = horizontal;*/
		},
		getCSSGridVariables() {
			const el = this.$refs.grid;
			const gridCols = parseInt(getComputedStyle(el).getPropertyValue('--cols'));
			const gridRows = parseInt(getComputedStyle(el).getPropertyValue('--rows'));
			this.gridCols = gridCols;
			this.gridRows = gridRows;
			this.setGridSize('setGridSize', {cols: gridCols, rows: gridRows});
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
	width: 2.5rem;
	height: 1.5rem;
}
</style>
