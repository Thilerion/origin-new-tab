<template>
	<div
		class="widget"
		:class="widgetPointerEvents"
	>
		<StartDragResize
			:canDrag="canDrag"
			:canResize="canResize"
			:widgetCols="widget.column"
			:widgetRows="widget.row"
			class="widget-drag-resize"
			@moveWidget="moveWidget"
			@resizeWidget="resizeWidget"
		>
		<transition name="widget-fade">
			<component
				:is="widgetComponent"
				class="widget-inner"
				:style="{'font-size': widgetFontSize}"
				:class="alignmentClass"
			/>	
		</transition>		
		</StartDragResize>
		<StartWidgetSettings
			class="widget-settings"
			v-if="dndEnabled"
			:widget="widget"
		/>
	</div>
</template>

<script>
import StartClock from "../widgets/Clock.vue";
import StartWallpaperDetails from '../widgets/WallpaperDetails.vue';
import StartQuote from '../widgets/Quote.vue';
import StartWeather from '../widgets/Weather.vue';
import StartNews from '../widgets/News.vue';
import StartSettingsButton from '../SettingsButton.vue';
import StartTopPages from '../widgets/TopPages.vue';
import StartCalendar from '../widgets/Calendar.vue';
import StartWidgetSettings from './WidgetSettings.vue';
import StartDragResize from './DragResize.vue';

import {settingsOptions} from '@/store/libs/defaultUserSettings';
import {mapState} from 'vuex';

export default {
	components: {
		StartClock,
		StartWallpaperDetails,
		StartQuote,
		StartWeather,
		StartNews,
		StartSettingsButton,
		StartTopPages,
		StartCalendar,
		StartWidgetSettings,
		StartDragResize
	},

	props: {

		widget: {
			type: Object,
			required: true
		},

		dndEnabled: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			baseFontSize: '1rem'
		}
	},

	computed: {

		...mapState(['gridCols', 'gridRows']),

		widgetPointerEvents() {
			if (!this.dndEnabled) return "widget-no-pointer";
		},

		canResize() {
			return settingsOptions.widgets.widgetOptions[this.widget.name].resize;
		},

		canDrag() {
			return settingsOptions.widgets.widgetOptions[this.widget.name].move;
		},

		columns() {
			return this.widget.column;
		},

		rows() {
			return this.widget.row;
		},

		widgetComponent() {
			let name = this.widget.name;
			return `Start${name.charAt(0).toUpperCase()}${name.slice(1)}`;
		},

		widgetFontSize() {
			let fontSizeMod = this.widget.fontSize || 0;
			return `calc(${fontSizeMod}px + ${this.baseFontSize})`;
		},
		
		alignmentClass() {
			return `w-align-${settingsOptions.widgets.align[this.widget.align]}`;
		}

	},

	methods: {
		moveWidget(moveCols, moveRows) {
			this.$store.dispatch('moveWidget', {name: this.widget.name, moveCols, moveRows});
		},
		resizeWidget(cols, rows) {
			this.$store.dispatch('resizeWidget', {name: this.widget.name, cols, rows});
		}
	}
}
</script>

<style>
.dnd .widget.draggable .widget-inner * {
	cursor: move;
}
</style>

<style scoped>
.widget {
	position: relative;
	opacity: 1;
}

.widget-no-pointer {
	pointer-events: none;
}

.widget-no-pointer .widget-inner {
	pointer-events: auto;
}
</style>
