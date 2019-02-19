<template>
	<div>
		<FormInput
			name="username"
			:label="$t('settings.username')"
			v-model="username"
			autocomplete="given-name"
		/>

		<FormRadioGroup
			:label="$t('settings.language')"
			:options="settingOptions.language.options"
			v-model="language"
		/>

		<FormRadioGroup
			:label="$t('settings.timeFormat')"
			:options="settingOptions.timeFormat.options"
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
				this.$i18n.locale = value;
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
			this.$store.commit('updateSettings', {
				key: 'general',
				settings: {
					[key]: value
				}
			})
		}
	}
}
</script>