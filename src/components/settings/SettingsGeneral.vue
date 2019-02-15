<template>
	<div>
		<FormInput
			name="username"
			label="Username"
			v-model="username"
			autocomplete="given-name"
		/>

		<FormRadioGroup
			label="Language"
			:options="[
				{value: 'en', name: 'English'},
				{value: 'nl', name: 'Nederlands'}
			]"
			v-model="language"
		/>

		<FormRadioGroup
			label="Time format"
			:options="[
				{value: 'HH:mm', name: '24-hour'},
				{value: 'h:mm a', name: '12-hour'}
			]"
			v-model="timeFormat"
		/>
	</div>
</template>

<script>
import FormRadioGroup from '../form/FormRadioGroup.vue';
import FormInput from '../form/FormInput.vue';

export default {
	components: {
		FormRadioGroup,
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
			return this.$store.state.settings.general;
		},
		username: {
			get() {
				return this.settings.username;
			},
			set(value) {
				this.updateSetting('username', value);
			}
		},
		language: {
			get() {
				return this.settings.language;
			},
			set(value) {
				this.updateSetting('language', value);
			}
		},
		timeFormat: {
			get() {
				return this.settings.timeFormat;
			},
			set(value) {
				this.updateSetting('timeFormat', value);
			}
		}
	},
	methods: {
		updateSetting(key, value) {
			this.$store.commit('updateSettings', {key: 'general', settings: {
				[key]: value
			}})
		}
	}
}
</script>

<style scoped>
.form-item {
	margin-bottom: 1rem;
}
</style>

<style>
.form-label {
	margin-bottom: 0.25rem;
}
</style>
