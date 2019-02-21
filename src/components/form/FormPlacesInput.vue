<template>
	<div class="form-item">
		<div v-if="limitError" class="form-error">Too many requests. Please try again later.</div>
		<div class="form-error" v-else-if="unexpectedError">An unexpected error occured trying to retrieve location data. Please try again later.</div>
		<input type="search" class="input" :name="name" :id="name" :placeholder="placeholder" ref="algoliaInput" v-bind="$attrs">
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
			limitError: false,
			unexpectedError: false
		}
	},
	methods: {
		setNewLocation(val) {
			const city = val.suggestion.type === 'city' ? val.suggestion.name : val.suggestion.city;
			const country = val.suggestion.country;
			const street = val.suggestion.type === 'address' ? val.suggestion.name : null;
			const latitude = val.suggestion.latlng.lat;
			const longitude = val.suggestion.latlng.lng;
			const value = val.suggestion.value;

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
		places.on('clear', () => {
			this.$emit('clear');
		})
		places.on('limit', msg => {
			this.limitError = true;
		})
		places.on('error', msg => {
			console.error(msg);
			this.unexpectedError = true;
		})

		places.setVal(this.value);
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

.form-error {
	color: red;
	font-size: 11px;
	margin-top: -1em;
	margin-bottom: 0.5em;
}
</style>

<style>
.ap-dropdown-menu {
	font-size: 14px;
}

.ap-suggestion {
	height: 36px;
	line-height: 36px;
}

.ap-suggestion-icon svg {
	transform: scale(0.75) translateY(6px);
}

.ap-cursor .ap-suggestion-icon svg {
	transform: scale(0.8) translateY(4px);
}

.ap-footer {
	opacity: 0.5;
	font-size: 10px;
	line-height: 10px;
	padding-top: 10px;
}
.ap-footer:hover {
	opacity: 0.7;
}
</style>
