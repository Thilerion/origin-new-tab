<template>
	<div
		class="widget-base"
		@mousedown="widgetMouseDownHandler($event, 'move')"
		@click="widgetClickHandler"
		:class="{
			resizing,
			moving
		}"
	>

		<slot />

		<div
			class="edit-overlay"
			:class="{selected}"
			v-if="editing">

			<div class="widget-name"
			>{{widget.name | removeWidgetStr}}</div>

		</div>

		<template v-if="showResizeHandles">
			<div
				v-for="handle in resizeHandles"
				:key="handle"
				class="resize-handle"
				:class="handle"
				@mousedown.stop.prevent="widgetMouseDownHandler($event, 'resize', handle)"
			>

			</div>
		</template>
	</div>
</template>

<script>
import Movable from '@/mixins/Movable';
import Resizable from '@/mixins/Resizable';

import { displayConfigs } from '@/widgets';

export default {
	mixins: [Movable({}), Resizable({})],
	props: {
		idx: {
			type: Number,
			required: true
		},
		widget: {
			type: Object,
			required: true
		},
		editing: {
			type: Boolean,
			default: false
		},
		selected: {
			type: Boolean,
			default: false
		},
		gridSize: {
			type: Object,
			required: true
		},
		cellSize: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			widgetPos: {
				x: null,
				y: null,
				width: null,
				height: null
			},
			displayConf: {}
		}
	},
	computed: {
		originalRowStart() {
			const delta = this.widgetPos.y - this.gridSize.y;
			return 1 + (Math.round(delta / this.cellSize.height));
		},
		originalColStart() {
			const delta = this.widgetPos.x - this.gridSize.x;
			return 1 + (Math.round(delta / this.cellSize.width));
		},

		initialGridPos() {
			const {x, y, width, height} = this.widgetPos;
			if (x == null || y == null) {
				const inStore = this.$store.state.grid.gridWidgets[this.idx];
				return {x: inStore.x, y: inStore.y, width: inStore.width, height: inStore.height};
			}
			return {
				x: Math.round(x / this.cellSize.width) + 1,
				y: Math.round(y / this.cellSize.height) + 1,
				width: Math.round(width / this.cellSize.width),
				height: Math.round(height / this.cellSize.height)
			};
		},

		showResizeHandles() {
			// TODO: and only if canResize is true on widget config
			return this.selected && !!this.resizeHandles && Array.isArray(this.resizeHandles);
		}
	},
	methods: {
		widgetMouseDownHandler(e, action, handle) {
			if (!this.selected && !!this.editing) {
				console.log('Widget mousedown not triggered because widget not selected.');
				return;
			} else if (!this.editing) {
				console.log('Widget mousedown not triggered because not in editing mode.');
				return;
			}

			if (action === 'move') {
				this.onMoveStart(e);
				return false;
			} else if (action === 'resize' && !!handle) {
				this.onResizeStart(e, handle);
				return false;
			} else {
				console.error('Widget mousedown not triggered; no valid action.', {action, handle});
			}
		},
		widgetClickHandler(e) {
			if (!this.editing) {
				console.log("No select action; not in editing mode.");
			} else if (!this.selected) {
				console.log("Selecting...");
				this.$emit('selectWidget', true);
			} else if (this.selected && !this.resizing && !this.moving) {
				console.log("Deselecting...");
				this.$emit('selectWidget', false);
			} else {
				console.log("No select action; widget is moving or resizing.");
			}
		},
		getWidgetSize() {
			const el = this.$el;
			const rect = el.getBoundingClientRect();
			this.widgetPos = {
				x: rect.x,
				y: rect.y,
				width: rect.width,
				height: rect.height
			}
		},
		updateWidgetGridPosition({x, y}) {
			console.log({x, y});
			this.$store.commit('setGridWidgetDimensions', {
				idx: this.idx,
				options: {
					x: this.originalColStart + x,
					y: this.originalRowStart + y
				}
			})
		},
		updateWidgetGridSize({x, y, width, height}) {
			this.$store.commit('setGridWidgetDimensions', {
				idx: this.idx,
				options: {
					x,
					y,
					width,
					height
				}
			})
		}
	},
	mounted() {
		this.getWidgetSize();
	},
	created() {
		this.displayConf = displayConfigs[this.widget.name];
	},
	filters: {
		removeWidgetStr(val) {
			if (val.startsWith('Widget')) {
				return val.slice(6);
			}
			return val;
		}
	}
}
</script>

<style>
.widget-base {
	--overlay-color: rgba(230, 230, 255, 0.8);
	--overlay-border: rgba(109, 209, 255, 0.75);

	--overlay-selected-color: rgba(175, 223, 255, 0.85);
	/* --overlay-selected-color-hover: rgba(175, 223, 255, 0.9); */

	--border-selected-color: rgb(53, 174, 255);
	
	--border-size: 4px;
}

.widget-base:hover {
	--overlay-color: rgba(230, 230, 255, 0.9);
	--overlay-selected-color: rgba(175, 223, 255, 0.9);
}
</style>

<style scoped>
.widget-base {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.edit-overlay {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: var(--overlay-color);
	border: var(--border-size) solid var(--overlay-border);
	user-select: none;
	transition: all .5s ease;
}

.edit-overlay.selected {
	background: var(--overlay-selected-color);
	border-color: var(--border-selected-color);
}

.widget-name {
	font-size: 1.25rem;
	position: absolute;
	background-color: #333;
	border-radius: 1em;
	padding: 0.5em 1em;
}

.resize-handle {
	--handle-size: 12px;
	--half-handle-size: calc(-1 * (var(--handle-size) - var(--border-size)) / 2);

	position: absolute;
	width: var(--handle-size);
	height: var(--handle-size);
	background-color: white;
	border: 2px solid var(--border-selected-color);
	border-radius: 2px;
}

.resize-handle.top,
.resize-handle.top-left,
.resize-handle.top-right {
	top: var(--half-handle-size);
}

.resize-handle.bottom,
.resize-handle.bottom-left,
.resize-handle.bottom-right {
	bottom: var(--half-handle-size);
}

.resize-handle.left,
.resize-handle.top-left,
.resize-handle.bottom-left {
	left: var(--half-handle-size);
}

.resize-handle.right,
.resize-handle.top-right,
.resize-handle.bottom-right {
	right: var(--half-handle-size);
}

.resize-handle.top,
.resize-handle.bottom {
	cursor: ns-resize;
	left: calc(50% + var(--half-handle-size));
}

.resize-handle.left,
.resize-handle.right {
	cursor: ew-resize;
	top: calc(50% + var(--half-handle-size));
}

.resize-handle.top-left,
.resize-handle.bottom-right {
	cursor: nwse-resize;
}

.resize-handle.top-right,
.resize-handle.bottom-left {
	cursor: nesw-resize;
}
</style>
