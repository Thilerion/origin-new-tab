<template>
	<div
		class="drag-resize-wrapper"
		:class="dragResizeClasses"
		:draggable="canDrag && dndEnabled"
	>
		<slot/>
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
.dnd-active.is-draggable, .dnd-active.is-draggable * {
	cursor: move!important;
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