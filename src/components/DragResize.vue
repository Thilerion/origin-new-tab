<template>
	<div
		class="drag-resize-wrapper"
		:class="dragResizeClasses"
		:draggable="canDrag && dndEnabled"
	>
		<div class="event-areas" v-if="dndEnabled">
			<div
				v-if="canResize"
				v-for="handle in handles"
				:key="handle"
				class="resize-handle"
				:class="'handle-' + handle"
			></div>
			<div v-if="canDrag" class="handle-center"></div>
		</div>		

		<div class="widget-slot-wrapper">
			<slot/>
		</div>		
	</div>
</template>

<script>
export default {
	props: {
		canDrag: {
			type: Boolean,
			default: false
		},
		canResize: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			handles: ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
		}
	},
	computed: {
		dndEnabled() {
			return this.$store.getters.dndEnabled;
		},
		dragResizeClasses() {
			const classes = [];
			if (this.canDrag) classes.push('is-draggable');
			if (this.canResize) classes.push('is-resizable');
			if (this.dndEnabled) classes.push('dnd-active');
			if (this.isDragged) classes.push('is-dragged');
			return classes;
		}
	}
}
</script>

<style>
.drag-resize-wrapper {
	position: relative;
	height: 100%;
	width: 100%;
}

.widget-slot-wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.dnd-active.is-draggable, .dnd-active.is-resizable {
	box-shadow: 0 0 2px 5px rgba(255,255,255,0.2);
	transition: box-shadow .2s ease, background-color .1s ease;
}

.dnd-active.is-draggable:hover {
	box-shadow: 0 0 5px 5px rgba(255, 255, 255, 0.8);
}

.dnd-active.is-draggable:hover, .dnd-active.is-resizable:hover {	
	background-color: rgba(50, 100, 200, 0.2);
}


</style>

<style>
.event-areas {
	position: absolute;
	top: -5px; left: -5px;
	width: calc(100% + 10px);
	height: calc(100% + 10px);
	display: grid;
	grid-template-rows: 1rem auto 1rem;
	grid-template-columns: 1rem auto 1rem;
}

.dnd-active.is-draggable .widget-slot-wrapper, .dnd-active.is-resizable .widget-slot-wrapper {
	pointer-events: none;
}

.resize-handle {
	border: 1px solid green;
}

.handle-nw, .handle-n, .handle-ne {
	grid-row: 1;
}

.handle-sw, .handle-s, .handle-se {
	grid-row: 3;
}

.handle-w, .handle-nw, .handle-sw {
	grid-column: 1;
}

.handle-e, .handle-ne, .handle-se {
	grid-column: 3;
}

.handle-w, .handle-center, .handle-e {
	grid-row: 2;
}

.handle-n, .handle-center, .handle-s {
	grid-column: 2;
}

.handle-e, .handle-w {
	cursor: ew-resize;
}

.handle-n, .handle-s {
	cursor: ns-resize;
}

.handle-ne, .handle-sw {
	cursor: nesw-resize;
}

.handle-nw, .handle-se {
	cursor: nwse-resize;
}

.handle-center {
	cursor: move;
}
</style>