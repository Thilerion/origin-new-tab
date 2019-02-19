<template>
	<div>
		<FormRangeSlider
			label="Amount"
			name="amount"
			:options="settingOptions.amount.options"
			v-model="amount"
		/>
		<FormRangeSlider
			label="Items per row"
			name="amountPerRow"
			:options="settingOptions.amountPerRow.options"
			v-model="amountPerRow"
		/>
	</div>
</template>

<script>
import FormRangeSlider from '@/components/form/FormRangeSlider.vue';
export default {
	components: {
		FormRangeSlider
	},
	props: {
		settingOptions: {
			type: Object,
			required: true
		}
	},
	computed: {
		settings() {
			return this.$store.state.settings.quicklinks;
		},
		amount: {
			get() {
				return this.settings.amount;
			},
			set(value) {
				this.updateSetting('amount', value);
			}
		},
		amountPerRow: {
			get() {
				return this.settings.amountPerRow;
			},
			set(value) {
				this.updateSetting('amountPerRow', value);
			}
		}
	},
	methods: {
		updateSetting(key, value) {
			this.$store.commit('updateSettings', {
				key: 'quicklinks',
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
