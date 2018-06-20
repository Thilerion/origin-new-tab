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
				@dragstart.stop="resizeStart(handle, $event)"
				draggable
			></div>

			<div
				v-if="canDrag"
				class="handle-center"
				@dragstart.stop="dragStart"
				draggable
			></div>

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
			handles: ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'],
			dragData: {
				initial: [null, null],
				current: [null, null]
			},
			resizeData: {

			}
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
	},
	methods: {
		//DRAG
		dragStart(e) {
			this.dragData.initial = [e.clientX, e.clientY];
			this.dragData.current = [e.clientX, e.clientY];
			
			let el = e.target;

			console.warn("Drag start");

			el.addEventListener('drag', this.dragging)
			el.addEventListener('dragend', this.dragEnd)
		},
		dragging: (e) => {
			console.log("Dragging");
		},
		dragEnd(e) {
			console.warn("Drag end", e);
			const el = e.target;
			el.removeEventListener('drag', this.dragging);
			el.removeEventListener('dragend', this.dragEnd)
		},
		//RESIZE
		resizeStart(handle, e) {
			console.log(handle, e);
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
	box-shadow: 0 0 2px 4px rgba(255,255,255,0.4), inset 0 0 2px 2px rgba(255,255,255,0.2);
	transition: box-shadow 200ms ease, background-color 400ms ease;
}

.dnd-active.is-draggable:hover {
	box-shadow: 0 0 2px 4px rgba(255,255,255,0.8), inset 0 0 2px 2px rgba(255,255,255,0.8);
}

.dnd-active.is-draggable:hover, .dnd-active.is-resizable:hover {	
	background-color: rgba(255, 255, 255, 0.2);
}


</style>

<style>
.drag-resize-wrapper {
	--corner-sizing: auto;
	--corner-size: 1.5rem;
	--center-size: 5fr;
}

.event-areas {
	position: absolute;
	top: -5px; left: -5px;
	width: calc(100% + 10px);
	height: calc(100% + 10px);
	display: grid;
	grid-template-rows: var(--corner-sizing) var(--center-size) var(--corner-sizing);
	grid-template-columns: var(--corner-sizing) var(--center-size) var(--corner-sizing);
}

.dnd-active.is-draggable .widget-slot-wrapper, .dnd-active.is-resizable .widget-slot-wrapper {
	pointer-events: none;
}

.drag-resize-wrapper .resize-handle {
	--edge-colour: rgba(2, 132, 84, 0.1);
	--corner-colour: rgba(108, 45, 147, 0.1);
	transition: box-shadow 200ms ease;

	--shadow-size: 1rem;
	--offset: calc(var(--shadow-size) * 0.8);
	--blur: calc(var(--shadow-size) * 0.8);	
	
	--n-offset: calc(var(--offset) * -1);
}

.drag-resize-wrapper:hover .resize-handle {
	--edge-colour: rgba(2, 132, 84, 0.3);
	--corner-colour: rgba(108, 45, 147, 0.3);

	--offset: calc(var(--shadow-size) * 1.1);
	--blur: calc(var(--shadow-size) * 1.2);
}

.drag-resize-wrapper .resize-handle:hover {
	transition: box-shadow 150ms ease 50ms;
	--edge-colour: rgba(2, 132, 84, 1);
	--corner-colour: rgba(108, 45, 147, 1);

	--offset: calc(var(--shadow-size) * 1.2);
	--blur: calc(var(--shadow-size) * 1.5);
}

.handle-nw, .handle-ne, .handle-sw, .handle-se {
	width: var(--corner-size);
	height: var(--corner-size);
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

.handle-n {
	box-shadow: inset
				0
				var(--offset)
				var(--blur)
				-10px
				var(--edge-colour);
}

.handle-s {
	box-shadow: inset
				0
				var(--n-offset)
				var(--blur)
				-10px
				var(--edge-colour);
}

.handle-w {
	box-shadow: inset
				var(--offset)
				0
				var(--blur)
				-10px
				var(--edge-colour);
}

.handle-e {
	box-shadow: inset
				var(--n-offset)
				0
				var(--blur)
				-10px
				var(--edge-colour);
}

.handle-nw {
	box-shadow: inset
				var(--offset)
				var(--offset)
				var(--blur)
				-10px
				var(--corner-colour);
}

.handle-ne {
	box-shadow: inset
				var(--n-offset)
				var(--offset)
				var(--blur)
				-10px
				var(--corner-colour);
}

.handle-se {
	box-shadow: inset
				var(--n-offset)
				var(--n-offset)
				var(--blur)
				-10px
				var(--corner-colour);
}

.handle-sw {
	box-shadow: inset
				var(--offset)
				var(--n-offset)
				var(--blur)
				-10px
				var(--corner-colour);
}
</style>