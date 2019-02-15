<template>
	<div>
		<label for="date">Show date</label>
		<input type="checkbox" name="date" id="date" v-model="showDate">

		<label for="greeting">Show text greeting</label>
		<input type="checkbox" name="greeting" id="greeting" v-model="showTextGreeting">
	</div>
</template>

<script>
export default {
	props: {
		settingOptions: {
			type: Object,
			required: true
		}
	},
	computed: {
		settings() {
			return this.$store.state.settings.clock;
		},
		showDate: {
			get() {
				return this.settings.showDate;
			},
			set(value) {
				this.updateSetting('showDate', value);
			}
		},
		showTextGreeting: {
			get() {
				return this.settings.showTextGreeting;
			},
			set(value) {
				this.updateSetting('showTextGreeting', value);
			}
		}
	},
	methods: {
		updateSetting(key, value) {
			this.$store.commit('updateSettings', {
				key: 'clock',
				settings: {
					[key]: value
				}
			})
		}
	}
}
</script>

<style>

</style>
