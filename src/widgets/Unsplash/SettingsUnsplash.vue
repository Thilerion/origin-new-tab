<template>
	<div>
		<FormSelect
			name="collection"
			label="Collection"
			:options="settingOptions.collection.options"
			v-model="collection"
		/>
		<FormSelect
			name="refreshInterval"
			label="New Wallpaper Photo Interval"
			:options="settingOptions.refreshInterval.options"
			v-model="refreshInterval"
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
			return this.$store.state.settings.unsplash;
		},
		collection: {
			get() {
				return `${this.settings.collection}`;
			},
			set(value) {
				const str = `${value}`;
				this.updateSetting('collection', str);
			}
		},
		refreshInterval: {
			get() {
				return this.settings.refreshInterval;
			},
			set(value) {
				this.updateSetting('refreshInterval', value);
			}
		}
	},
	methods: {
		updateSetting(key, value) {
			this.$store.commit('updateSettings', {
				key: 'unsplash',
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