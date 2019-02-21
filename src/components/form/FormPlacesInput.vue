<template>
	<div class="form-item">
		<input type="search" class="input" :name="name" :id="name" :placeholder="placeholder" ref="algoliaInput" v-bind="$attrs" :value="trueValue">
	</div>
</template>

<script>
import initPlaces from '@/utils/algolia.js';

export default {
	inheritAttrs: false,
	props: {
		name: {
			type: String,
			required: true
		},
		placeholder: {
			type: String,
			default: ''
		},
		value: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			trueValue: ''
		}
	},
	methods: {
		setNewLocation(val) {
			console.log(val);
			const city = val.suggestion.type === 'city' ? val.suggestion.name : val.suggestion.city;
			const country = val.suggestion.country;
			const street = val.suggestion.type === 'address' ? val.suggestion.name : null;
			const latitude = val.suggestion.latlng.lat;
			const longitude = val.suggestion.latlng.lng;
			const value = val.suggestion.value;
			console.log({street, city, country, latitude, longitude, value});

			this.trueValue = value;

			this.$emit('newLocation', {street, city, country, latitude, longitude, value});
		}
	},
	computed: {
		algoliaOptions() {
			return {
				language: this.$store.state.settings.general.language,
				aroundLatLngViaIP: true
			}
		}
	},
	mounted() {
		const el = this.$refs.algoliaInput;
		const places = initPlaces(el, this.algoliaOptions);
		
		this.$_places = places;

		places.on('change', this.setNewLocation);

		this.trueValue = this.value;
	},
	beforeDestroy() {
		if (this.$_places && this.$_places.destroy) {
			this.$_places.destroy();
		}
	}
}
</script>

<style scoped>
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
}

.input::-webkit-search-decoration, .input::-webkit-search-cancel-button {
	appearance: none;
}

.input::-ms-clear {
  display: none;
}

.input:active, .input:focus {
	border-color: rgb(112, 174, 255);
	box-shadow: 0 0 0 0.125em rgba(112, 174, 255, 0.3);
}

.input:disabled {
	background: hsl(0, 0%, 90%);
	box-shadow: none;
	border-color: #bbb;
	color: #aaa;
}

.input::placeholder {
	opacity: 0.5;
}
</style>
