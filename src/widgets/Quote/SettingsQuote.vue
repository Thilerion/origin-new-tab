<template>
	<FormSelect
		name="category"
		:label="$t('quote.settings.category')"
		:options="settingOptions.category.options"
		v-model="category"
	/>
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
			return this.$store.state.settings.quote;
		},
		category: {
			get() {
				return this.settings.category;
			},
			set(value) {
				this.updateSetting('category', value);
				this.$store.dispatch('quote/getNewQuote');
			}
		}
	},
	methods: {
		updateSetting(key, value) {
			this.$store.commit('updateSettings', {
				key: 'quote',
				settings: {
					[key]: value
				}
			})
		}
	}
}
</script>

<style scoped>

</style>
