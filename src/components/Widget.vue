<template>
	<div
		class="widget"
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
			<component
				:is="widgetComponent"
				class="widget-inner"
				:style="{'font-size': widgetFontSize}"
			/>

			<StartWidgetSettings
				class="widget-settings"
				v-if="dndEnabled"
				@changeFontSize="changeFontSize"
				:widget="widget"
			/>
		</StartDragResize>
	</div>
</template>

<script>
import StartGreeting from "./widgets/Greeting.vue";
import StartWallpaperDetails from './widgets/WallpaperDetails.vue';
import StartQuote from './widgets/Quote.vue';
import StartWeather from './widgets/Weather.vue';
import StartNews from './widgets/News.vue';
import StartSettingsButton from './SettingsButton.vue';
import StartTopPages from './widgets/TopPages.vue';
import StartCalendar from './widgets/Calendar.vue';
import StartWidgetSettings from './WidgetSettings.vue';
import StartDragResize from './DragResize.vue';

import {settingsOptions} from '@/store/defaultUserSettings';

export default {
	components: {
		StartGreeting,
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

		canResize() {
			return settingsOptions.widgets.widgetOptions[this.widget.name].resize;
		},

		canDrag() {
			return settingsOptions.widgets.widgetOptions[this.widget.name].move;
		},

		gridCols() {
			return this.$store.getters.gridCols;
		},

		gridRows() {
			return this.$store.getters.gridRows;
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
		}

	},

	methods: {
		changeFontSize(amount) {
			if (amount < 0) {
				this.$store.commit('decreaseFontSize', this.widget.name);
			} else if (amount > 0) {
				this.$store.commit('increaseFontSize', this.widget.name);
			}				
		},
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
}

.widget-settings {	
	position: absolute;
	top: 0;
	right: 0;	
	max-height: 100%;
}
</style>
