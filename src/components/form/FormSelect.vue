<template>
	<div class="select form-item">
		<label class="form-label select-label" v-if="$slots.default" :for="name"><slot/></label>
		<select :id="name" :name="name" :value="value" @input="$emit('input', $event.target.value)" v-bind="$attrs">
			<option v-for="option in options" :value="option.value" :key="option.name">{{translate(option)}}</option>
		</select>
		<div class="select-arrow">
			<IconArrowDown class="icon" />
		</div>
	</div>
</template>

<script>
import IconArrowDown from '@/assets/icons/ui/md-arrow-down.svg';

export default {
	components: {
		IconArrowDown
	},
	inheritAttrs: false,
	props: {
		name: {
			type: String,
			required: true
		},
		options: {
			type: Array,
			required: true
		},
		value: {
			type: [String, Number],
			required: true
		}
	},
	methods: {
		translate(obj) {
			if (obj.localePath) return this.$t(obj.localePath);
			return obj.name;
		}
	}
}
</script>

<style scoped>
.select-label {
	display: block;
}

.select {
	width: 15em;
	position: relative;
}

.select > select {	
	appearance: none;
	padding-right: 2.5em;
}

select {
	border: 1px solid #bbb;
	background-color: white;
	color: inherit;
	border-radius: 4px;

	padding: calc(.375em - 1px) calc(.625em - 1px);
	position: relative;
	height: 2.25em;
	line-height: 1.5;
	font-size: 1rem;
	width: 100%;
	cursor: pointer;
}

select:active, select:focus {	
	outline: none;
	border-color: rgb(112, 174, 255);
	box-shadow: 0 0 0 0.125em rgba(112, 174, 255, 0.3);
}

.select-arrow {
	position: absolute;
	right: 0;
	bottom: 0;
	width: 2.25em;
	height: 2.25em;
	display: flex;
	justify-content: center;
	align-items: center;
	pointer-events: none;
	opacity: 0.5;
	transition: opacity .15s;
}

.select:hover .select-arrow {
	opacity: 1;
}
</style>
