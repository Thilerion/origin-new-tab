<template>
	<div
		class="widget-base"
		@mousedown="onMoveStart">

		<slot />

		<div
			class="edit-overlay"
			:class="{selected}"
			v-if="editing">

			<div class="widget-name"
			>{{widget.name | removeWidgetStr}}</div>

		</div>
	</div>
</template>

<script>
import Movable from '@/mixins/Movable';

export default {
	mixins: [Movable({})],
	props: {
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
			widgetSize: {
				x: null,
				y: null,
				width: null,
				height: null
			}
		}
	},
	methods: {
		calculateGridSize() {

		},
		calculateWidgetSize() {
			
		}
	},
	mounted() {
		this.calculateGridSize();
		this.calculateWidgetSize();
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
	--overlay-color-hover: rgba(230, 230, 255, 0.9);

	--overlay-selected-color: rgba(175, 223, 255, 0.85);
	--overlay-selected-color-hover: rgba(175, 223, 255, 0.9);

	--border-selected-color: rgb(53, 174, 255);
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
	border: 4px solid var(--overlay-color);
	user-select: none;
}

.edit-overlay:hover {
	background: var(--overlay-color-hover);
}

.edit-overlay.selected {
	background: var(--overlay-selected-color);
	border-color: var(--border-selected-color);
}

.edit-overlay.selected:hover {
	background: var(--overlay-selected-color-hover);
}

.widget-name {
	font-size: 1.25rem;
	position: absolute;
	background-color: #333;
	border-radius: 1em;
	padding: 0.5em 1em;
}
</style>
