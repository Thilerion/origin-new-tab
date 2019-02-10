<template>
	<div
		class="widget-base"
		:class="{
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
			></div>
		</template>
	</div>
</template>

<script>
import Movable from '@/mixins/Movable';
import Resizable from '@/mixins/Resizable';

export default {
	// mixins: [Movable({}), Resizable({})],
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
		
	},
	methods: {
		
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
