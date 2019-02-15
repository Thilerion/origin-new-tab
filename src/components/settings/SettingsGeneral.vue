<template>
	<div>
		<label for="username">Username</label>
		<input type="text" name="username" id="username" class="input" autocomplete="given-name">

		<FormRadioGroup
			label="Language"
			:options="[
				{value: 'en', name: 'English'},
				{value: 'nl', name: 'Nederlands'}
			]"
			v-model="language"
		/>

		<label for="timeFormat">Time Format</label>
		<input type="checkbox" name="timeFormat" id="timeFormat">
	</div>
</template>

<script>
import FormRadioGroup from '../form/FormRadioGroup.vue';

export default {
	components: {
		FormRadioGroup
	},
	data() {
		return {
			language: 'en'
		}
	}
}
</script>

<style scoped>

</style>
