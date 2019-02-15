<template>
	<div>
		<FormInput
			name="username"
			label="Username"
			v-model="username"
			autocomplete="given-name"
		/>

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
import FormInput from '../form/FormInput.vue';

export default {
	components: {
		FormRadioGroup,
		FormInput,
	},
	data() {
		return {
			language: 'en',
			username: 'Michael'
		}
	},
	methods: {
		logInput(e, b) {
			console.log(e, b);
		} 
	}
}
</script>

<style scoped>

</style>
