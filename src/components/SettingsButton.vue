<template>
	<div class="btn-wrapper">
		<button class="icon-btn">
			<IconSettings class="icon" />
		</button>
	</div>
</template>

<script>
import IconSettings from '@/assets/icons/ui/md-settings.svg';

export default {
	components: {
		IconSettings
	}
}
</script>

<style scoped>
.btn-wrapper {
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	/* Padding for alignment due to uneven padding on grid */
	padding-right: .25rem;
}

.icon-btn {
	opacity: 0.7;
	transition: opacity .25s ease;
}
.icon-btn:hover {
	opacity: 1;
}

.icon {
	width: 20px;
	height: 20px;
}
</style>
