<template>
	<div class="widget-settings" ref="widgetSettings" :style="positionStyles">
		<div class="widget-setting-group widget-settings-font" v-if="canChangeFontSize">
			<button 
				class="widget-setting-btn font-btn decrease icon-btn"
				:disabled="minFontSizeReached"
				@click="decreaseFontSize"
			>-</button>
			<span class="setting-name">Text</span>
			<button
				class="widget-setting-btn font-btn increase icon-btn"
				:disabled="maxFontSizeReached"
				@click="increaseFontSize"
			>+</button>
		</div>
		<div class="widget-setting-group widget-settings-align" v-if="canChangeAlignment">
			<button
				class="widget-setting-btn icon-btn align-btn"
				@click="changeAlignment(0)"
				:class="{'active-alignment': currentAlignment === 0}"
			>
				<StartSvgIcon icon="align-left" />
			</button>
			<button
				class="widget-setting-btn icon-btn align-btn"
				@click="changeAlignment(1)"
				:class="{'active-alignment': currentAlignment === 1}"
			>
				<StartSvgIcon icon="align-center" />
			</button>
			<button
				class="widget-setting-btn icon-btn align-btn"
				@click="changeAlignment(2)"
				:class="{'active-alignment': currentAlignment === 2}"
			>
				<StartSvgIcon icon="align-right" />
			</button>
		</div>
		<div class="widget-setting-group widget-settings-align" v-if="canChangeVAlignment">
			<button
				class="widget-setting-btn icon-btn align-btn"
				@click="changeVAlignment(0)"
				:class="{'active-alignment': currentVAlignment === 0}"
			>
				Top
			</button>
			<button
				class="widget-setting-btn icon-btn align-btn"
				@click="changeVAlignment(1)"
				:class="{'active-alignment': currentVAlignment === 1}"
			>
				Middle
			</button>
			<button
				class="widget-setting-btn icon-btn align-btn"
				@click="changeVAlignment(2)"
				:class="{'active-alignment': currentVAlignment === 2}"
			>
				Bottom
			</button>
		</div>
	</div>
</template>

<script>
import {settingsOptions, defaultSettings} from '@/store/libs/defaultUserSettings';
const WIDGET_OPTIONS = settingsOptions.widgets.widgetOptions;
const WIDGET_DEFAULTS = defaultSettings.widgets;

const FONT_SIZE_OPTIONS = settingsOptions.widgets.fontSize;
const ALIGN_OPTIONS = settingsOptions.widgets.align;

export default {
	props: {
		widget: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			widgetOptions: WIDGET_OPTIONS[this.widget.name],
			widgetDefaults: WIDGET_DEFAULTS.find(w => w.name === this.widget.name),

			fontSizeOptions: FONT_SIZE_OPTIONS,
			alignOptions: ALIGN_OPTIONS,

			positionTop: null,
			positionLeft: null
		}
	},
	computed: {
		canChangeFontSize() {
			return !!this.widgetOptions.fontSize.canChange;
		},
		minFontSizeReached() {
			return this.widget.fontSize <= this.widgetOptions.fontSize.min;
		},
		maxFontSizeReached() {
			return this.widget.fontSize >= this.widgetOptions.fontSize.max;
		},
		defaultFontSize() {
			return this.widgetDefaults.fontSize;
		},

		canChangeAlignment() {
			return !!this.widgetOptions.align;
		},
		defaultAlignment() {
			return this.widgetDefaults.align;
		},
		currentAlignment() {
			return this.widget.align;
		},

		canChangeVAlignment() {
			return !!this.widgetOptions.vAlign;
		},
		defaultVAlignment() {
			return this.widgetDefaults.vAlign;
		},
		currentVAlignment() {
			return this.widget.vAlign;
		},

		positionStyles() {
			if (this.positionTop == null || this.positionLeft == null) {
				return {display: "none"};
			}
			let tY = 0;
			let tX = 0;
			let styles = {};

			if (this.positionTop) {
				styles.top = 0;
			} else styles.bottom = 0;

			if (this.positionLeft) {
				styles.left = 0;
			} else styles.right = 0;

			return styles;
		},

		currentPosition() {
			return [...this.widget.column, ...this.widget.row];
		}
	},
	methods: {
		increaseFontSize() {
			this.$store.dispatch('changeWidgetFontSize', {name: this.widget.name, value: 1});
		},
		decreaseFontSize() {
			this.$store.dispatch('changeWidgetFontSize', {name: this.widget.name, value: -1});
		},
		changeAlignment(alignment) {
			this.$store.dispatch('changeWidgetAlignment', {name: this.widget.name, alignment});
		},
		changeVAlignment(alignment) {
			this.$store.dispatch('changeWidgetVerticalAlignment', {name: this.widget.name, alignment});
		},
		getElementRelativePosition() {
			const rect = this.$parent.$el.getBoundingClientRect();
			const x = (rect.left + rect.right) / 2;
			const y = (rect.top + rect.bottom) / 2;

			console.log(this.widget.name, x, y);

			const windowHeight = window.innerHeight;
			const windowWidth = window.innerWidth;
			if (x < windowWidth / 2) this.positionLeft = false;
			else this.positionLeft = true;

			if (y < windowHeight / 2) this.positionTop = false;
			else this.positionTop = true;
		}
	},
	mounted() {
		this.getElementRelativePosition();
	},
	watch: {
		currentPosition: {
			handler(newValue, oldValue) {
				this.getElementRelativePosition();
			},
			deep: true
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
	position: absolute;	
	max-height: 100%;
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
	border-radius: 4px;
	cursor: pointer;
	transition: all .1s ease;
}

.font-btn {
	width: 1em;
	height: 1em;
	font-size: 14px;
	line-height: 10px;
	background-color: black;
	color: white;
}

.align-btn.active-alignment {
	background-color: black;
	color: white;
	cursor: default;
}

.align-btn:not(.active-alignment):hover {
	background-color: black;
	color: white;
}

.font-btn:hover:not(:active) {
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
