<template>
	<div class="widget-base">
		<slot />
		<div v-if="editing" class="widget-edit-name">{{widget.name | removeWidgetStr}}</div>
	</div>
</template>

<script>
export default {
	props: {
		widget: {
			type: Object,
			required: true
		},
		editing: {
			type: Boolean,
			default: false
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

<style scoped>
.widget-base {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.editing .widget-base {
	border: 2px solid white;
	border-radius: 5px;
	background: rgba(255, 255, 255, 0.8);
}

.widget-edit-name {
	font-size: 1.25rem;
	position: absolute;
	background-color: #333;
	border-radius: 1em;
	padding: 0.5em 1em;
}
</style>
