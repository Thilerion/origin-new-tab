<template>
	<div class="form-item">
		<label :for="name" class="input-label">{{label}}</label>
		<div class="slider-wrapper">
			<input
				type="range"
				class="slider"
				:id="name"
				:name="name"
				:min="options.min"
				:max="options.max"
				:step="options.step"
				v-bind="$attrs"
				@input="$emit('input', $event.target.value)">
			<div class="slider-value">{{value}}</div>
		</div>
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
		label: {
			type: String
		},
		options: {
			type: Object,
			required: true
		},
		value: {
			type: [String, Number],
			required: true
		}
	}
}
</script>

<style scoped>
.input-label {
	display: block;
	margin-bottom: 0.25em;
}

.slider-wrapper {
	display: flex;
	align-items: center;
	width: 100%;
	max-width: 400px;
}

.slider {
	flex: 1 1 auto;
}

.slider-value {
	flex: 0 0 3em;
	padding-left: 1em;
	text-align: left;
	font-size: 0.9em;
}
</style>
