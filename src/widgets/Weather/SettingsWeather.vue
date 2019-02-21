<template>
<div>
	<FormToggle
		name="useCustomLocation"
		v-model="useCustomLocation"
	>Use custom location</FormToggle>
	<FormInput
		name="customLocation"
		v-model="customLocation"
		:disabled="!useCustomLocation"
		placeholder="Search location"
	/>
	<FormRadioGroup
		:label="$t('weather.settings.units')"
		:options="settingOptions.units.options"
		v-model="units"
	/>
</div>
</template>

<script>
import FormRadioGroup from '@/components/form/FormRadioGroup.vue';
import FormToggle from '@/components/form/FormToggle.vue';
import FormInput from '@/components/form/FormInput.vue';

export default {
	components: {
		FormRadioGroup,
		FormToggle,
		FormInput,
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
		},
		useCustomLocation: {
			get() {
				return this.settings.useCustomLocation;
			},
			set(value) {
				this.updateSetting('useCustomLocation', value);
			}
		},
		customLocation: {
			get() {
				return this.settings.customLocation;
			},
			set(value) {
				this.updateSetting('customLocation', value);
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