<template>
	<div class="form-item form-toggle">
		<label class="toggle-label" :for="name"><slot/></label>
		<input class="toggle-input" type="checkbox" :name="name" :id="name" :checked="value" @input="$emit('input', $event.target.checked)">
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
		value: {
			type: Boolean,
			required: true
		}
	}
}
</script>

<style scoped>
.form-toggle {
	display: flex;
	align-items: center;
}

.toggle-label {
	flex: 1;
}

.toggle-input {
	--w: 36px;
	--latch-w: 14px;
	--latch-pad: 2px;
	--latch-translate: calc(var(--w) - var(--latch-w) - 2 * var(--latch-pad));

	flex: 0 0 auto;

	appearance: none;
	width: var(--w);
	height: 18px;
	border-radius: 5px;

	display: inline-block;
	position: relative;
	cursor: pointer;
	outline: none;
	background-color: rgba(68, 68, 68, 0.4);

	transition: background .15s ease;
}

.toggle-input::after {
	display: block;
	position: absolute;
	width: var(--latch-w);
	height: 14px;
	border-radius: 4px;
	top: 2px;
	left: var(--latch-pad);
	background-color: rgb(247, 247, 247);
	font-size: 11px;
	content: "";

	transform: scale(0.857);
	transform-origin: left center;
	transition: transform .15s ease;
}

.toggle-input:checked {
	background-color: rgba(31, 182, 26, 0.747);
}

.toggle-input:checked::after {
	transform: translateX(var(--latch-translate));
	background-color: rgb(255, 255, 255);
}
</style>
