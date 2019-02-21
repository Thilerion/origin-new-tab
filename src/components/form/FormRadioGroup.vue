<template>
	<fieldset class="radio-group form-item">
		<legend class="radio-group-label form-label">{{label}}</legend>

		<div
			v-for="option in options"
			:key="option.value"
			class="radio-group-item"
			:class="{inline: !stacked}"
		>
			<input
				type="radio"
				:name="label"
				:value="option.value"
				:id="option.value"
				v-model="selected"
				class="radio">
			<label
				:for="option.value"
				class="label-radio"
			>{{option.localePath ? $t(option.localePath) : option.name}}</label>
		</div>
	</fieldset>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			required: true
		},
		options: {
			type: Array,
			required: true
		},
		stacked: {
			type: Boolean,
			default: false
		},
		value: {
			type: String,
			required: true
		}
	},
	computed: {
		selected: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('input', value);
			}
		}
	}
}
</script>

<style scoped>
fieldset {
	min-width: 0;
	padding: 0;
	margin: 0;
	border: 0;
}

.radio-group-item {
	display: flex;
	align-items: center;
}

.radio-group-item.inline {
	display: inline-flex;
}

.radio-group-item.inline:not(:last-child) {
	margin-right: 1.25rem;
}

.label-radio {
	margin-left: 0.5rem;
}
</style>
