<template>
	<div class="widget-news" v-if="canShow">

	</div>
</template>

<script>
import { register, persist } from './store.js';

export default {
	data() {
		return {

		}
	},
	computed: {
		canShow() {
			return this.$store.getters['news/showComponent'];
		}
	},
	beforeCreate() {
		register(this.$store);
		persist(this.$store);
		this.$store.dispatch('news/init');
	}
}
</script>

<style scoped>

</style>
