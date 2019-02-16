<template>
<div class="edit-sidebar">
	<div class="current-widgets">
		<h2 class="widgets-title">Current widgets</h2>
		<div class="widgets-list">
			<WidgetInfo
				v-for="widget in sortedWidgets"
				:key="widget.uid"
				v-bind="widget"
				class="widget-info"
				:class="{selected: widget === selected}"
				@click.native="$emit('selectWidget', widget.uid, true)"
			/>
		</div>
	</div>
	<div class="align-widget" v-if="selected != null">
		<h2 class="align-title">Align content</h2>
		<h3 class="align-subtitle">Horizontal</h3>
		<div class="align-buttons">
		<button class="button" :class="{current: selected.alignX === ALIGN.start}" @click="alignWidget('x', ALIGN.start)">Left</button>
		<button class="button" :class="{current: selected.alignX === ALIGN.center}" @click="alignWidget('x', ALIGN.center)">Center</button>
		<button class="button" :class="{current: selected.alignX === ALIGN.end}" @click="alignWidget('x', ALIGN.end)">Right</button>
		</div>

		<h3 class="align-subtitle">Vertical</h3>
		<div class="align-buttons">
		<button class="button" :class="{current: selected.alignY === ALIGN.start}" @click="alignWidget('y', ALIGN.start)">Top</button>
		<button class="button" :class="{current: selected.alignY === ALIGN.center}" @click="alignWidget('y', ALIGN.center)">Center</button>
		<button class="button" :class="{current: selected.alignY === ALIGN.end}" @click="alignWidget('y', ALIGN.end)">Bottom</button>
		</div>
	</div>
</div>
</template>

<script>
import { ALIGN } from '@/constants';

import WidgetInfo from './WidgetInfo.vue';

export default {
	props: {
		selected: Object,
		sortedWidgets: Array
	},
	components: {
		WidgetInfo
	},
	data() {
		return {
			ALIGN: {...ALIGN}
		}
	},
	methods: {
		alignWidget(dir, alignment) {
			this.$store.commit('editWidgetAlignment', {
				uid: this.selected.uid,
				dir,
				alignment
			})
		}
	}
}
</script>

<style scoped>
.edit-sidebar {
	min-width: 0;
	width: 250px;
	background: hsla(0, 0%, 97%, 0.9);
	height: 100%;
	color: #333;
	border-left: 1px solid #bbb;
}

.widgets-title {
	padding: 1rem;
	border-bottom: 1px solid #bbb;
	font-size: 1.125rem;
}

.align-title {
	font-size: 1.125rem;
	padding: 1.5rem 1rem 0.5rem;
}

.align-subtitle {
	font-size: 1rem;
	padding: 0.5rem 1rem;
}

.widgets-list {
	display: flex;
	flex-direction: column-reverse;
}

.widget-info {
	padding: 1rem;
	border-bottom: 1px solid #bbb;
	cursor: pointer;
}

.widget-info:hover, .widget-info.selected {
	background: rgba(0, 0, 0, 0.08);
}

.align-buttons {
	padding: 0 1rem;
	display: flex;
	justify-content: space-between;
}

.align-buttons > .button {
	font-size: 0.875rem;
	flex: 0 0 30%;
}

.button.current {
	background-color: #333;
	color: white;
}
</style>
