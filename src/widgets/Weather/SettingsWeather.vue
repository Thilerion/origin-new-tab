<template>
	<FormRadioGroup
		:label="$t('weather.settings.units')"
		:options="settingOptions.units.options"
		v-model="units"
	/>
</template>

<script>
import FormRadioGroup from '@/components/form/FormRadioGroup.vue';
export default {
	components: {
		FormRadioGroup
	},
	props: {
		settingOptions: {
			type: Object,
			required: true
		}
	},
	computed: {
		settings() {
			return this.$store.state.settings.weather;
		},
		units: {
			get() {
				return this.settings.units;
			},
			set(value) {
				this.updateSetting('units', value);
			}
		}
	},
	methods: {
		updateSetting(key, value) {
			this.$store.commit('updateSettings', {
				key: 'weather',
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