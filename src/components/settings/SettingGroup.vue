<template>
	<div
		class="setting-group"
		:class="{'accordion': canCompress, 'compressed': !isExpanded && canCompress}"
		@click="toggleExpand"
	>
		<h2
			class="setting-group-heading"
		><slot name="header" /></h2>
		<div class="accordion-icon" :class="{rotated: !isExpanded}">
			<StartSvgIcon v-if="canCompress" icon="arrow-down" size="24" />
		</div>
		
		<StartTransitionExpand>
			<div
				class="setting-group-content"
				v-show="isExpanded || !canCompress"
			>
				<slot/>
			</div>
		</StartTransitionExpand>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isExpanded: false
		}
	},
	props: {
		canCompress: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		toggleExpand() {
			if (!this.canCompress) return;
			this.isExpanded = !this.isExpanded;
		}
	}
}
</script>

<style scoped>
.setting-group {
	display: flex;
	border-bottom: 1px solid rgba(255,255,255,0.4);
	margin-bottom: 1rem;
	position: relative;
}

.setting-group.accordion {
	cursor: pointer;
	margin-top: -1rem;
	padding-top: 1rem;
}

.setting-group-heading {
	flex: 0 0 15rem;
	font-size: 1.25rem;
	font-weight: normal;
	text-transform: capitalize;
	margin-bottom: 1rem;
}

.accordion .setting-group-heading {
	flex: 0 0 12rem;
}

.accordion .accordion-icon {
	flex: 0 0 3rem;
}

.accordion-icon svg {
	transition: transform 0.2s ease;
}

.accordion-icon.rotated svg {
	transform: rotate(180deg);
}

.setting-group-content {
	flex: 1 1 auto;
	position: relative;
	height: auto;
}
</style>
