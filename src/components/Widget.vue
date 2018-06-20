<template>
	<div
		class="widget"
	>
		<StartDragResize
			:canDrag="canDrag"
			:canResize="canResize"
			class="widget-drag-resize"
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
				@changeWidth="changeWidth"
				@changeHeight="changeHeight"
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
		},

		gridSize: {
			type: Array
		}
	},

	data() {
		return {
			baseFontSize: '1rem'
		}
	},

	computed: {

		canResize() {
			return settingsOptions.user.widgetOptions[this.widget.name].resize;
		},

		canDrag() {
			return settingsOptions.user.widgetOptions[this.widget.name].move;
		},

		gridCols() {
			return this.gridSize[1];
		},

		gridRows() {
			return this.gridSize[0];
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
		changeHeight(amount) {
			const data = {
				name: this.widget.name,
				gridRows: this.gridRows,
				widgetRows: this.rows,
				change: amount
			};
			this.$store.commit('changeWidgetHeight', data);
		},
		changeWidth(amount) {
			const data = {
				name: this.widget.name,
				gridCols: this.gridCols,
				widgetCols: this.columns,
				change: amount
			};
			this.$store.commit('changeWidgetWidth', data);
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

.widget-drag-resize {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.widget-settings {	
	position: absolute;
	top: 0;
	right: 0;	
	max-height: 100%;
}
</style>
