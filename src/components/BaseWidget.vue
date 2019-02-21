<template>
	<div
		class="widget-base"
		:class="{
			moving: movingActive,
			resizing: resizingActive
		}"
		@mousedown="onMoveStart"
	>

		<div
			class="widget-overflow-wrapper" 
			:style="widgetAlignment"
		>
			<slot />
		</div>

		<BaseFadeTransition type="fade" enterDuration="300" leaveDuration="0">
		<div
			class="edit-overlay"
			:class="{selected}"
			v-if="editing">

			<div class="widget-name"
			>{{$t(`widgetName.${widget.name}`)}}</div>

		</div>
		</BaseFadeTransition>

		<template v-if="showResizeHandles">
			<div
				v-for="handle in resizeHandles"
				:key="handle"
				class="resize-handle"
				:class="handle"
				@mousedown.stop.prevent="onResizeStart($event, handle)"
			></div>
		</template>
	</div>
</template>

<script>
import Movable from '@/mixins/Movable';
import Resizable from '@/mixins/Resizable';

import {ALIGN} from '@/constants';

export default {
	mixins: [Movable, Resizable],
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
		},
		config: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
		}
	},
	computed: {
		showResizeHandles() {
			return this.editing && this.selected && this.config.canResize;
		},
		maxHeight() {
			return this.config.maxHeight || this.rows;
		},
		maxWidth() {
			return this.config.maxWidth || this.cols;
		},
		minHeight() {
			return this.config.minHeight || this.rowStart;
		},
		minWidth() {
			return this.config.minWidth || this.colStart;
		},
		cols() {
			return this.$store.state.grid.cols;
		},
		rows() {
			return this.$store.state.grid.rows;
		},
		colStart() {
			return 1;
		},
		colEnd() {
			return this.cols + 1;
		},
		rowStart() {
			return 1;
		},
		rowEnd() {
			return this.rows + 1;
		},

		manipulatingActive() {
			return this.resizingActive || this.movingActive;
		},

		widgetAlignment() {
			let align, justify;

			if (this.widget.alignY === ALIGN.start) align = 'flex-start';
			else if (this.widget.alignY === ALIGN.end) align = 'flex-end';
			else if (this.widget.alignY === ALIGN.center) align = 'center';

			if (this.widget.alignX === ALIGN.start) justify = 'flex-start';
			else if (this.widget.alignX === ALIGN.end) justify = 'flex-end';
			else if (this.widget.alignX === ALIGN.center) justify = 'center';

			return {
				'align-items': align,
				'justify-content': justify,
			};
		}
	},
	methods: {
		convertHorPxToGrid(x) {
			return Math.round(x / this.cellSize.width);
		},
		convertVerPxToGrid(y) {
			return Math.round(y / this.cellSize.height);
		},
		getWidgetPlaceOnGrid() {
			return {
				x: this.widget.x,
				y: this.widget.y,
				width: this.widget.width,
				height: this.widget.height,

				left: this.widget.x,
				right: this.widget.x + this.widget.width,
				top: this.widget.y,
				bottom: this.widget.y + this.widget.height
			}
		},

		updateWidgetMovement(x, y) {
			this.$store.dispatch('setWidgetPosition', {
				type: 'move',
				idx: this.idx,
				values: {x, y}
			});
			this.emitIfCentered(x, y, this.widget.width, this.widget.height);
		},
		updateWidgetSize({x, y, width, height}) {
			this.$store.dispatch('setWidgetPosition', {
				type: 'resize',
				idx: this.idx,
				values: {x, y, width, height}
			});
			this.emitIfCentered(x, y, width, height);
		},
		emitIfCentered(x, y, width, height) {
			if (!this.resizingActive && !this.movingActive) {
				return;
			}

			const evenWidth = width % 2 === 0;
			const evenHeight = height % 2 === 0;

			console.log({evenWidth, evenHeight});

			let isCenteredX = false;
			let isCenteredY = false;

			if (evenWidth) {
				const spaceLeft = x - this.colStart;
				const spaceRight = this.colEnd - (x + width);
				if (spaceLeft === spaceRight) isCenteredX = true;
			}
			if (evenHeight) {
				const spaceTop = y - this.rowStart;
				const spaceBottom = this.rowEnd - (y + height);
				if (spaceTop === spaceBottom) isCenteredY = true;
			}

			this.$emit('updateCenterGuides', {x: isCenteredX, y: isCenteredY});
		}
	},
	watch: {
		manipulatingActive(newValue, oldValue) {
			if (newValue === false && oldValue !== false) {
				// Don't show center guides if not moving or resizing
				this.$emit('updateCenterGuides', {x: false, y: false});
			} else {
				this.emitIfCentered(this.widget.x, this.widget.y, this.widget.width, this.widget.height);
			}
		}
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

.widget-base.moving {
	--overlay-selected-color: rgba(169, 248, 138, 0.85);
}
.widget-base.resizing {
	--overlay-selected-color: rgba(171, 138, 248, 0.85);
}
</style>

<style scoped>
.widget-base {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.widget-overflow-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.editing .widget-overflow-wrapper {
	overflow: hidden;
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

.edit-overlay:hover {
	cursor: pointer;
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
