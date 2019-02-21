<template>
	<div class="widget-info">
		<span class="name">{{$t(`widgetName.${name}`)}}</span>
		<button class="icon-btn" @click="deleteWidget"><IconClose class="icon small" /></button>
	</div>
</template>

<script>
import IconClose from '@/assets/icons/ui/md-close.svg';

export default {
	components: {
		IconClose
	},
	props: {
		name: String,
		uid: String,
		idx: Number,
		x: Number,
		y: Number,
		alignX: String,
		alignY: String,
		width: Number,
		height: Number
	},
	methods: {
		deleteWidget() {
			this.$store.commit('deleteWidget', this.uid);
		}
	}
}
</script>

<style scoped>
.widget-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
