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
		<h2>Align</h2>
		<h3>Horizontal</h3>
		<button @click="alignWidget('x', ALIGN.start)">Left</button>
		<button @click="alignWidget('x', ALIGN.center)">Center</button>
		<button @click="alignWidget('x', ALIGN.end)">Right</button>

		<h3>Vertical</h3>
		<button @click="alignWidget('y', ALIGN.start)">Top</button>
		<button @click="alignWidget('y', ALIGN.center)">Center</button>
		<button @click="alignWidget('y', ALIGN.end)">Bottom</button>
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
</style>
