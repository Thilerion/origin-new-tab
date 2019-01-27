<template>
	<div
		class="setting-group"
		:class="{'accordion': canCompress, 'compressed': !isExpanded && canCompress}" @click="toggleExpandIfCompressed"
	>
		<h2
			class="setting-group-heading"			
			@click.stop="toggleExpand"
		><slot name="header" /></h2>
		<div class="accordion-icon" :class="{rotated: !isExpanded}" 
		@click.stop="toggleExpand">
			<SvgIcon v-if="canCompress" icon="arrow-down" size="24" />
		</div>
		
		<TransitionExpand>
			<div
				class="setting-group-content"
				v-show="isExpanded || !canCompress"
			>
				<slot/>
			</div>
		</TransitionExpand>
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
		},
		toggleExpandIfCompressed() {
			if (!this.canCompress) return;
			if (!this.isExpanded) this.isExpanded = !this.isExpanded;
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
	flex: 0 0 1.5rem;
	margin-right: 1.5rem;
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

.setting-group-heading, .accordion-icon {
	user-select: none;
}

.accordion .setting-group-heading, .accordion .accordion-icon {
	cursor: pointer;
}

.compressed {
	cursor: pointer;
}
</style>
