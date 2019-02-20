<template>
	<div>
		<FormSelect
			name="slideInterval"
			:label="$t('news.settings.slideInterval')"
			:options="settingOptions.slideInterval.options"
			v-model="slideInterval"
		/>
	</div>
</template>

<script>
import FormSelect from '@/components/form/FormSelect.vue';
export default {
	components: {
		FormSelect
	},
	props: {
		settingOptions: {
			type: Object,
			required: true
		}
	},
	computed: {
		settings() {
			return this.$store.state.settings.news;
		},
		slideInterval: {
			get() {
				return this.settings.slideInterval;
			},
			set(value) {
				this.updateSetting('slideInterval', value);
			}
		}
	},
	methods: {
		updateSetting(key, value) {
			this.$store.commit('updateSettings', {
				key: 'news',
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