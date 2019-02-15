<template>
	<div>
		<FormToggle
			name="date"
			v-model="showDate"
		>Show date</FormToggle>

		<FormToggle
			name="greeting"
			v-model="showTextGreeting"
		>Show text greeting</FormToggle>
	</div>
</template>

<script>
import FormToggle from '@/components/form/FormToggle.vue';

export default {
	components: {
		FormToggle
	},
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
