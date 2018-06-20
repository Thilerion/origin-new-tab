<template>
	<div
		class="widget"
	>
		<component
			:is="widgetComponent"
			class="widget-inner"
			:style="{'font-size': widgetFontSize}"
		/>

		<div class="widget-settings" v-if="dndEnabled">
			<div class="widget-setting-group widget-settings-font" v-if="canChangeFontSize">
				<button 
					class="widget-setting-btn decrease icon-btn"
					:disabled="minFontSizeReached"
					@click="decreaseFontSize"
				>-</button>
				<span class="setting-name">Text</span>
				<button
					class="widget-setting-btn increase icon-btn"
					:disabled="maxFontSizeReached"
					@click="increaseFontSize"
				>+</button>
			</div>

			<div class="widget-setting-group widget-settings-width" v-if="canChangeWidth">
				<button
					class="widget-setting-btn decrease icon-btn"
					@click="decreaseWidth"
				>-</button>
				<span class="setting-name">Width</span>
				<button
					class="widget-setting-btn increase icon-btn"
					@click="increaseWidth"
				>+</button>
			</div>

			<div class="widget-setting-group widget-settings-height" v-if="canChangeHeight">
				<button
					class="widget-setting-btn decrease icon-btn"
					@click="decreaseHeight"
				>-</button>
				<span class="setting-name">Height</span>
				<button
					class="widget-setting-btn increase icon-btn"
					@click="increaseHeight"
				>+</button>
			</div>

		</div>
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
		StartCalendar
	},

	props: {

		widget: {
			type: Object,
			required: true
		},

		adjustableWidget: {
			type: Boolean,
			default: false
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
			baseFontSize: '1rem',
			widgetOptions: settingsOptions.user.widgetOptions[this.widget.name]
		}
	},

	computed: {

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
		},

		canChangeFontSize() {
			return !!this.widgetOptions.fontSize;
		},

		maxFontSizeReached() {
			return this.widget.fontSize >= settingsOptions.user.widgetFontSize.max;
		},

		minFontSizeReached() {
			return this.widget.fontSize <= settingsOptions.user.widgetFontSize.min;
		},

		canChangeHeight() {
			return !!this.widgetOptions.height;
		},

		canChangeWidth() {
			return !!this.widgetOptions.width;
		}

	},

	methods: {

		increaseFontSize() {
			this.$store.commit('increaseFontSize', this.widget.name);
		},

		decreaseFontSize() {
			this.$store.commit('decreaseFontSize', this.widget.name);
		},

		//TODO: mutation needs "gridCols" variable
		increaseHeight() {
			const data = {
				name: this.widget.name,
				gridRows: this.gridRows,
				widgetRows: this.rows,
				change: 1
			};
			this.$store.commit('changeWidgetHeight', data);
		},

		decreaseHeight() {
			const data = {
				name: this.widget.name,
				gridRows: this.gridRows,
				widgetRows: this.rows,
				change: -1
			};
			this.$store.commit('changeWidgetHeight', data);
		},

		increaseWidth() {
			const data = {
				name: this.widget.name,
				gridCols: this.gridCols,
				widgetCols: this.columns,
				change: 1
			};
			this.$store.commit('changeWidgetWidth', data);
		},

		decreaseWidth() {
			const data = {
				name: this.widget.name,
				gridCols: this.gridCols,
				widgetCols: this.columns,
				change: -1
			};
			this.$store.commit('changeWidgetWidth', data);
		}

	}
}
</script>

<style>
.dnd .draggable .widget-inner {
	/* cursor: move; */
}

.dnd .widget.draggable .widget-inner * {
	cursor: move;
}
</style>

<style scoped>
.widget-settings {
	/* background: white; */
	color: black;
	font-size: 12px;
	display: flex;
	position: absolute;
	top: 0;
	right: 0;
	opacity: 0.2;
	flex-direction: column;
	align-items: stretch;
	justify-content:stretch;
	max-height: 100%;
	flex-wrap: wrap-reverse;
}

.widget:hover .widget-settings {
	opacity: 1;
}

.widget-setting-group {
	flex: 1 1 auto;
	white-space: nowrap;
	padding: 0.2em 0.3em;
	display: flex;
	align-items: center;
	background: white;
}

.widget-setting-group:last-of-type {
	border-bottom-left-radius: 4px;
	padding-bottom: 0.3em;
}

.setting-name {
	flex: 1 1 auto;
	text-align: center;
}

.widget-setting-btn {
	border: 2px solid transparent;
	background-color: black;
	color: white;
	border-radius: 4px;
	width: 1em;
	height: 1em;
	font-size: 14px;
	line-height: 10px;
	cursor: pointer;
	transition: all .1s ease;
}

.widget-setting-btn:hover:not(:active) {
	background: transparent;
	color: black;
	border: 2px solid black;
}

.widget-setting-btn.decrease {
	margin-right: 0.2em;
}

.widget-setting-btn.increase {
	margin-left: 0.2em;
}
</style>
