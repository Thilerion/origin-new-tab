<template>
	<div>
		news
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
			return this.$store.state.settings.news;
		},
		showDate: {
			get() {
			},
			set(value) {
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