<template>
<div>
	<FormToggle
		name="useCustomLocation"
		v-model="useCustomLocation"
	>Use custom location</FormToggle>
	<FormPlacesInput
		name="customLocation"
		:value="customLocation.value"
		@newLocation="setCustomLocation"
		@clear="clearCustomLocation"
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
	data() {
		return {
			initialCustom: {},

			resetCustomLocationData: {
				street: null,
				city: null,
				country: null,
				latitude: null,
				longitude: null,
				value: null
			}
		}
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
		},
		setCustomLocation(value) {
			this.customLocation = {...value};
		},
		clearCustomLocation() {
			this.customLocation = {...this.resetCustomLocationData}
		},
		requestWeatherDataUpdate() {
			this.$store.dispatch('weather/updateWithNewLocation');
		},
		shouldWeatherDataUpdate(data) {
			const oldData = JSON.stringify(this.initialCustom);
			const newData = JSON.stringify(data);

			if (oldData === newData) {
				console.log('No changes in data');
				return;
			}

			const before = this.initialCustom;
			const after = data;

			const hasCustomCoords = (after.latitude != null && after.longitude != null);

			if (after.useCustomLocation && !before.useCustomLocation) {
				if (!hasCustomCoords) {
					// Use custom, but no location chosen, so set useCustom to false
					console.log('Reverting useCustomLocation change, setting to FALSE');
					this.useCustomLocation = false;
					this.clearCustomLocation();
				} else {
					// A location has been chosen, update weather
					console.log('Weather settings have changed, now using custom location');
					this.requestWeatherDataUpdate();
				}
			} else if (!after.useCustomLocation && before.useCustomLocation) {
				// Update weather, using the browser location data
				console.log('Weather settings have changed, now using browser location');
				this.requestWeatherDataUpdate();
			} else if (before.useCustomLocation && after.useCustomLocation && (before.latitude !== after.latitude || before.longitude !== after.longitude)) {
				// Coordinates have changed, update weather
				console.log('Weather settings have changed, now using a different custom location');
				this.requestWeatherDataUpdate();
			}
		}
	},
	beforeMount() {
		this.initialCustom = {...this.customLocation, useCustomLocation: this.useCustomLocation};
	},
	beforeDestroy() {
		this.shouldWeatherDataUpdate({
			...this.customLocation,
			useCustomLocation: this.useCustomLocation
		})
	}
}
</script>

<style>

</style>