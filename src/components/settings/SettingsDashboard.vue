<template>
	<div>
		<button class="form-item button" @click="closeAndEdit">{{$t('settings.configureLayout')}}</button>
		<div class="form-item">
			<h2 class="presets-heading form-label">{{$t('settings.choosePreset')}}</h2>
			<button
				class="button"
				v-for="preset in presets.options"
				:key="preset.name"
				@click="selectPreset(preset.name)"
			>{{translate(preset)}}</button>
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
		},
		translate(obj) {
			if (obj.localePath) return this.$t(obj.localePath);
			return obj.name;
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
