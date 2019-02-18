<template>
	<div>
		
	</div>
</template>

<script>
export default {
	components: {
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
	}
}
</script>

<style>

</style>