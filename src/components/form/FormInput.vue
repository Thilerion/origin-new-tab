<template>
	<div class="form-item" :class="{inline: !stacked}">
		<label :for="name" class="input-label form-label"><slot/></label>
		<input type="text" class="input" :name="name" :id="name" v-bind="$attrs" :value="value" @input="$emit('input', $event.target.value)" @keypress.enter="defocus">
	</div>
</template>

<script>
export default {
	inheritAttrs: false,
	props: {
		name: {
			type: String,
			required: true
		},
		stacked: {
			type: Boolean,
			default: true
		},
		value: {
			type: String,
			default: ''
		}
	},
	methods: {
		defocus(e) {
			e.target.blur();
		}
	}
}
</script>

<style scoped>
.input-label {
	display: block;
}
.inline .input-label {
	display: inline-block;
}

.input {
	border: 1px solid #bbb;
	background: white;
	color: inherit;
	border-radius: 4px;

	padding: calc(.375em - 1px) calc(.625em - 1px);
	position: relative;
	height: 2.25em;
	font-size: 1rem;
	line-height: 1.5;
	width: 15em;
}

.input:active, .input:focus {
	border-color: rgb(112, 174, 255);
	box-shadow: 0 0 0 0.125em rgba(112, 174, 255, 0.3);
}
</style>
