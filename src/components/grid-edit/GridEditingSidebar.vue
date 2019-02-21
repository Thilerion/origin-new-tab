<template>
<div class="edit-sidebar">
	<div class="sidebar-title">
		<h2>{{$t('configureDashboard')}}</h2>
		<button class="button" @click="$emit('done')"><IconDone class="icon" /> <span>Done</span></button>
	</div>
	<div class="current-widgets">
		<h3 class="widgets-title">{{$t('currentWidgets')}}</h3>
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
		<div class="widget-info add-widget-btn" v-if="!addingWidget" @click="showAddWidget">+ {{$t('addWidget')}}</div>
	</div>

	<div class="align-widget" v-if="selected != null">
		<h3 class="align-title">Align content</h3>
		<h4 class="align-subtitle">Horizontal</h4>
		<div class="align-buttons">
		<button class="button" :class="{current: selected.alignX === ALIGN.start}" @click="alignWidget('x', ALIGN.start)">Left</button>
		<button class="button" :class="{current: selected.alignX === ALIGN.center}" @click="alignWidget('x', ALIGN.center)">Center</button>
		<button class="button" :class="{current: selected.alignX === ALIGN.end}" @click="alignWidget('x', ALIGN.end)">Right</button>
		</div>

		<h4 class="align-subtitle">Vertical</h4>
		<div class="align-buttons">
		<button class="button" :class="{current: selected.alignY === ALIGN.start}" @click="alignWidget('y', ALIGN.start)">Top</button>
		<button class="button" :class="{current: selected.alignY === ALIGN.center}" @click="alignWidget('y', ALIGN.center)">Center</button>
		<button class="button" :class="{current: selected.alignY === ALIGN.end}" @click="alignWidget('y', ALIGN.end)">Bottom</button>
		</div>
	</div>

	<GridSidebarAddWidget class="add-widget" v-else-if="addingWidget"/>
</div>
</template>

<script>
import { ALIGN } from '@/constants';

import WidgetInfo from './WidgetInfo.vue';
import GridSidebarAddWidget from './GridSidebarAddWidget.vue';
import IconDone from '@/assets/icons/ui/md-done.svg';

export default {
	props: {
		selected: Object,
		sortedWidgets: Array
	},
	components: {
		WidgetInfo,
		GridSidebarAddWidget,
		IconDone
	},
	data() {
		return {
			ALIGN: {...ALIGN},
			addingWidget: false,
		}
	},
	methods: {
		alignWidget(dir, alignment) {
			this.$store.commit('editWidgetAlignment', {
				uid: this.selected.uid,
				dir,
				alignment
			})
		},
		showAddWidget() {
			if (this.addingWidget) {
				this.addingWidget = false;
			} else {
				this.addingWidget = true;
				this.$emit('selectWidget', null, false);
			}
		}
	},
	watch: {
		selected(newValue, oldValue) {
			if (oldValue == null && newValue != null) {
				if (this.addingWidget) {
					console.warn('Widget selected while "addingWidget"; disabling the addWidget component.');
					this.addingWidget = false;
				}
			}
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
	font-size: 0.85rem;
	overflow: auto;
}

.sidebar-title {
	background: hsla(0, 0%, 98%, 1);
	padding: 1rem;
	border-bottom: 1px solid #bbb;
	font-size: 1rem;
}

.widgets-title {
	padding: 1rem;
	font-size: 1.125em;
}

.align-title, .add-widget >>> .add-title {
	font-size: 1.125em;
	padding: 1.5em 1em 0.5em;
}

.align-subtitle {
	padding: 0.5rem 1rem;
}

.widgets-list {
	display: flex;
	flex-direction: column-reverse;
}

.widget-info {
	padding: 0.5em 1rem;
	border-bottom: 1px solid #bbb;
	cursor: pointer;
}

.add-widget-btn {
	font-style: italic;
	opacity: 0.8;
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
	font-size: 0.75rem;
	flex: 0 0 30%;
}

.button.current {
	background-color: #333;
	color: white;
}

.button {
	font-size: 0.9em;
	line-height: 1em;
	display: flex;
	align-items: center;
	margin-top: 1em;
}

.button > span {
	margin-left: 5px;
}
</style>
