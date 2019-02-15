<template>
	<div>
		<button class="form-item button" @click="closeAndEdit">Configure dashboard layout</button>
		<div class="form-item">
			<h2 class="presets-heading form-label">Choose preset</h2>
			<button
				class="button"
				v-for="preset in presets.options"
				:key="preset.value"
				@click="selectPreset(preset.value)"
			>{{preset.name}}</button>
		</div>
	</div>
</template>

<script>

export default {
	props: {
		settingOptions: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			showEditingOnClose: false
		}
	},
	computed: {
		presets() {
			return this.settingOptions.preset;
		}
	},
	methods: {
		selectPreset(value) {
			this.$store.dispatch('applyGridPreset', value);
			this.closeAndEdit();
		},
		closeAndEdit() {
			this.$store.commit('setShowSettingsOverlay', false);
			this.showEditingOnClose = true;
		}
	},
	destroyed() {
		if (this.showEditingOnClose) {
			this.$store.commit('setEditingGrid', true);
		}
	}
}
</script>

<style scoped>
.presets-heading {
	font-weight: normal;
}
</style>
