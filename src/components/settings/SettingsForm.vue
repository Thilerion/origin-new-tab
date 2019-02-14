<template>
	<div>
		<div v-for="setting in settings" :key="setting.name">
			<label>{{setting.label}}</label>
			<input v-if="setting.type === 'input'" :type="setting.inputType">
		</div>
	</div>
</template>

<script>
export default {
	props: {
		category: {
			type: String,
			required: true
		},
		settings: {
			type: Object,
			required: true
		}
	}
}
</script>

<style scoped>

</style>
