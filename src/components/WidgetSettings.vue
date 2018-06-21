<template>
	<div class="widget-settings">
		<div class="widget-setting-group widget-settings-font" v-if="canChangeFontSize">
			<button 
				class="widget-setting-btn decrease icon-btn"
				:disabled="minFontSizeReached"
				@click="$emit('changeFontSize', -1)"
			>-</button>
			<span class="setting-name">Text</span>
			<button
				class="widget-setting-btn increase icon-btn"
				:disabled="maxFontSizeReached"
				@click="$emit('changeFontSize', 1)"
			>+</button>
		</div>
	</div>
</template>

<script>
import {settingsOptions} from '@/store/defaultUserSettings';

export default {
	props: {
		widget: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			widgetOptions: settingsOptions.widgets.widgetOptions[this.widget.name]
		}
	},
	computed: {
		canChangeFontSize() {
			return !!this.widgetOptions.fontSize;
		},
		minFontSizeReached() {
			return this.widget.fontSize <= settingsOptions.widgets.fontSize.min;
		},
		maxFontSizeReached() {
			return this.widget.fontSize >= settingsOptions.widgets.fontSize.max;
		}
	}
}
</script>

<style scoped>
.widget-settings {
	color: black;
	font-size: 12px;
	display: flex;
	opacity: 0.2;
	flex-direction: column;
	align-items: stretch;
	justify-content:stretch;
	flex-wrap: wrap-reverse;
	transition: opacity .2s ease;
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
