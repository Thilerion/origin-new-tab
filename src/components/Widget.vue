<template>
	<div
		class="widget"
		:style="{'font-size': widgetFontSize}"
	>
		<component
			:is="widgetComponent"
			class="widget-inner"
		/>
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
		}
	},
	data() {
		return {
			baseFontSize: '1rem'
		}
	},
	computed: {
		widgetComponent() {
			let name = this.widget.name;
			return `Start${name.charAt(0).toUpperCase()}${name.slice(1)}`;
		},
		widgetFontSize() {
			let fontSizeMod = this.widget.fontSize || 0;
			return `calc(${fontSizeMod}px + ${this.baseFontSize})`;
		},
		canChangeFontSize() {
			return settingsOptions.user.widgetOptions[this.widget.name].fontSize;
		}
	}
}
</script>

<style scoped>

</style>
