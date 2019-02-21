<template>
<div>
	<FormToggle
		name="useCustomLocation"
		v-model="useCustomLocation"
	>Use custom location</FormToggle>
	<FormPlacesInput
		name="customLocation"
		:value="customLocation.value"
		@newLocation="customLocation = $event"
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
import FormPlacesInput from '@/components/form/FormPlacesInput.vue';

export default {
	components: {
		FormRadioGroup,
		FormToggle,
		FormPlacesInput,
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
	},
	beforeDestroy() {
		if (!this.useCustomLocation) {
			return;
		}
		if (!this.customLocation.latitude || !this.customLocation.longitude) {
			console.log('Use custom location is TRUE, but no custom location is set; updating useCustomLocation to FALSE.');
			this.useCustomLocation = false;
		}
	}
}
</script>

<style>

</style>