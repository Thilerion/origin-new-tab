<template>
	<div>
		<FormSelect
			name="collection"
			:options="settingOptions.collection.options"
			v-model="collection"
		>{{$t('unsplash.settings.collection')}}</FormSelect>
		<FormSelect
			name="refreshInterval"
			:options="settingOptions.refreshInterval.options"
			v-model="refreshInterval"
		>{{$t('unsplash.settings.newPhotoInterval')}}</FormSelect>
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
				this.loadNewCollection();				
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
		},
		// TODO: show if error with loading (store.state.unsplash.apiError?)
		async loadNewCollection() {
			const success = await this.$store.dispatch('unsplash/loadNewCollection');
			console.log({success});
		}
	}
}
</script>

<style>

</style>