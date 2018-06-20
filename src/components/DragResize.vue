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
import throttle from 'lodash.throttle';

export default {
	props: {
		canDrag: {
			type: Boolean,
			default: false
		},
		canResize: {
			type: Boolean,
			default: true
		},
		widgetRows: {
			type: Array,
			required: true
		},
		widgetCols: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			handles: ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'],
			dragData: {
				dragging: false,
				initial: [null, null],
				current: [null, null],
				initialCols: [null, null],
				initialRows: [null, null]
			},
			resizeData: {

			},
			gridCols: null,
			gridRows: null,
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight
		}
	},
	computed: {
		dndEnabled() {
			return this.$store.getters.dndEnabled;
		},
		dragResizeClasses() {
			const classes = [];
			if (this.dndEnabled) classes.push('dnd-active');

			if (this.dragData.dragging) {
				classes.push('is-dragging');
			} else if (this.resizeData.resizing) {
				classes.push('is-resizing');
			} else {
				if (this.canDrag) classes.push('is-draggable');
				if (this.canResize) classes.push('is-resizable');
			}

			return classes;
		},
		gridColWidth() {
			return this.windowWidth / this.gridCols;
		},
		gridRowHeight() {
			return this.windowHeight / this.gridRows;
		},
		columnsMoved() {
			if (!this.dragData.dragging) return 0;

			let initialCols = [...this.dragData.initialCols];

			const maxLimit = (this.gridCols + 1) - initialCols[1];
			const minLimit = initialCols[0] - 1;

			const pxMoved = this.dragData.current[0] - this.dragData.initial[0];
			const colsMoved = Math.round(pxMoved / this.gridColWidth);

			const colsMovedLimited = Math.min(maxLimit, Math.max(-minLimit, colsMoved));
			
			const colsMovedSinceStart = (initialCols[0] - this.widgetCols[0]);
			const absoluteMoved = colsMovedSinceStart + colsMovedLimited;
			return absoluteMoved;
		},
		rowsMoved() {
			if (!this.dragData.dragging) return 0;

			let initialRows = [...this.dragData.initialRows];

			const maxLimit = (this.gridRows + 1) - initialRows[1];
			const minLimit = initialRows[0] - 1;

			const pxMoved = this.dragData.current[1] - this.dragData.initial[1];
			const rowsMoved = Math.round(pxMoved / this.gridRowHeight);

			const rowsMovedLimited = Math.min(maxLimit, Math.max(-minLimit, rowsMoved));
			
			const rowsMovedSinceStart = (initialRows[0] - this.widgetRows[0]);
			const absoluteMoved = rowsMovedSinceStart + rowsMovedLimited;
			return absoluteMoved;
		},
		widgetMoved() {
			return [this.columnsMoved, this.rowsMoved];
		}
	},
	methods: {
		//DRAG
		dragStart(e) {
			this.dragData.initial = [e.clientX, e.clientY];
			this.dragData.current = [e.clientX, e.clientY];
			this.dragData.dragging = true;
			this.dragData.initialCols = [...this.widgetCols];
			this.dragData.initialRows = [...this.widgetRows];

			const emptyDragImage = document.createElement('div');
			e.dataTransfer.setDragImage(emptyDragImage, 0, 0);
			e.dataTransfer.effectAllowed = "move";

			e.target.addEventListener('drag', this.dragging)
			e.target.addEventListener('dragend', this.dragEnd)
		},
		dragging: throttle(function(e) {
			e.preventDefault();
			if (e.clientX > 5 && e.clientY > 5) {
				this.dragData.current = [e.clientX, e.clientY];
			}			
		}, 1000/30),

		dragEnd(e) {
			this.resetDrag(e.target);			
		},

		resetDrag(el) {
			this.dragData.initial = [null, null];
			this.dragData.current = [null, null];
			this.dragData.dragging = false;
			this.dragData.initialCols = [null, null];
			this.dragData.initialRows = [null, null];
			el.removeEventListener('drag', this.dragging);
			el.removeEventListener('dragend', this.dragEnd)
		},


		//RESIZE
		resizeStart(handle, e) {
			console.log(handle, e);
		},

		//OTHER
	},
	mounted() {
		this.gridCols = parseInt(getComputedStyle(this.$el).getPropertyValue('--cols'));
		this.gridRows = parseInt(getComputedStyle(this.$el).getPropertyValue('--rows'));
	},
	watch: {
		widgetMoved: {
			handler(newValue, oldValue) {
				const cols = newValue[0];
				const rows = newValue[1];

				if (cols === 0 && rows === 0) return;
				if (cols === oldValue[0] && rows === oldValue[1]) return;
				if (!this.dragging) return;
				
				this.$emit('moveWidget', cols, rows);					
			},
			deep: true
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

.dnd-active {
	transition: box-shadow 200ms ease, background-color 400ms ease;
}

.dnd-active.is-draggable, .dnd-active.is-resizable {
	box-shadow: 0 0 2px 4px rgba(255,255,255,0.4), inset 0 0 2px 2px rgba(255,255,255,0.2);
}

.dnd-active.is-draggable:hover {
	box-shadow: 0 0 2px 4px rgba(255,255,255,0.8), inset 0 0 2px 2px rgba(255,255,255,0.8);
}

.dnd-active.is-draggable:hover, .dnd-active.is-resizable:hover {	
	background-color: rgba(255, 255, 255, 0.2);
}

.dnd-active.is-dragging {
	box-shadow: 0 0 2px 4px rgba(0, 153, 255, 0.6), inset 0 0 2px 2px rgba(0, 153, 255, 0.3);
	background-color: rgba(41, 169, 255, 0.4);
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

.dnd-active.is-draggable .widget-slot-wrapper, .dnd-active.is-resizable .widget-slot-wrapper, .dnd-active.is-dragging .widget-slot-wrapper, .dnd-active.is-resizing .widget-slot-wrapper {
	pointer-events: none;
}

.is-resizable.drag-resize-wrapper {
	--shadow-size: 1rem;
}

.drag-resize-wrapper:not(.is-resizable) {
	--shadow-size: 0rem;
}

.drag-resize-wrapper .resize-handle {
	--edge-colour: rgba(2, 132, 84, 0.1);
	--corner-colour: rgba(108, 45, 147, 0.1);
	transition: box-shadow 200ms ease;

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

.handle-center, .is-dragging {
	cursor: move!important;
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