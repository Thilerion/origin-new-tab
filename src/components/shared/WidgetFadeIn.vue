<template>
	<transition
		name="widget-fade-in"
	>
		<slot/>
	</transition>
</template>

<script>
export default {

}
</script>

<style>
.widget-fade-in-enter-active {
	transition: opacity 0.2s ease;
}

.widget-fade-in-enter {
	opacity: 0;
}
</style>
