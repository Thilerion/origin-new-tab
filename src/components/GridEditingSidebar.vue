<template>
<div class="edit-sidebar">
	<div class="align-widget" v-if="selected != null">
		<h2>Align</h2>
		<h3>Horizontal</h3>
		<button @click="alignWidget('x', ALIGN.start)">Left</button>
		<button @click="alignWidget('x', ALIGN.center)">Center</button>
		<button @click="alignWidget('x', ALIGN.end)">Right</button>
		<button @click="alignWidget('x', ALIGN.stretch)">Stretch</button>

		<h3>Vertical</h3>
		<button @click="alignWidget('y', ALIGN.start)">Top</button>
		<button @click="alignWidget('y', ALIGN.center)">Center</button>
		<button @click="alignWidget('y', ALIGN.end)">Bottom</button>
		<button @click="alignWidget('y', ALIGN.stretch)">Stretch</button>
	</div>
</div>
</template>

<script>
import { ALIGN } from '@/constants';
export default {
	props: {
		selected: Object
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
	background: #f7f7f7;
	height: 100%;
	color: #333;
}
</style>
