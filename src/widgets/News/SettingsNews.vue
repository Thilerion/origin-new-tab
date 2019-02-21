<template>
	<div>
		<FormSelect
			name="slideInterval"
			:options="settingOptions.slideInterval.options"
			v-model="slideInterval"
		>{{$t('news.settings.slideInterval')}}</FormSelect>
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