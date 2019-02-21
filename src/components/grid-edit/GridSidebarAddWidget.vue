<template>
	<div>
		<h3 class="add-title">{{$t('addWidget')}}</h3>
		<div class="add-widget-info">{{$t('addWidgetInfo')}}</div>
		<div
			v-for="widget in available"
			:key="widget"
			class="widget-types"
			:class="{dragging: currentlyDragging === widget}"
			draggable
			@dragstart="onDragStart(widget, $event)"
			@dragend="onDragEnd"
		>
			{{$t(`widgetName.${widget}`)}}
		</div>
	</div>
</template>

<script>
import { displayConfigs } from '@/widgets';

export default {
	computed: {
		available() {
			// TODO: allow some widgets to be placed multiple times
			// return this.$store.getters.unusedGridWidgets;
			return this.$store.state.grid.allGridWidgetTypes;
		},
		currentlyDragging() {
			return this.$store.state.dragAddNewWidget.type;
		}
	},
	methods: {
		onDragStart(widgetType, e) {
			const {w, h} = this.getInitialSize(widgetType);

			const offsetX = e.offsetX;
			const offsetY = e.offsetY - (e.target.clientHeight / 2);

			const data = {
				widget: widgetType,
				width: w,
				height: h,
				offsetX: offsetX,
				offsetY: offsetY
			};
			this.$store.commit('initNewWidgetDrag', data);
		},
		onDragEnd() {
			this.$store.commit('stopNewWidgetDrag');
		},
		getInitialSize(widgetType) {
			// in order of preference, use initialSize, minSize, or 1
			const conf = displayConfigs[widgetType];
			let w = conf.initialWidth || conf.minWidth || 1;
			let h = conf.initialHeight || conf.minHeight || 1;

			return {w, h};
		}
	}
}
</script>

<style scoped>
.widget-types {
	border: 1px solid rgb(180, 180, 180);
	border-radius: 4px;
	cursor: pointer;
	padding: 0.6em;
	margin: 0 1rem 0.75em;
}

.dragging {
	border-style: dashed;
}

.add-widget-info {
	padding: 0.5em 1rem;
}
</style>
