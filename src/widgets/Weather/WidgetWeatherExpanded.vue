<template>
	<div class="weather-expanded">
		<transition name="slide">
			<div class="weather-expanded-inner" v-if="show">

			</div>
		</transition>
	</div>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false
		}
	}
}
</script>

<style scoped>
.weather-expanded {
	position: absolute;
	margin-top: 1em;
	right: 0;
	width: 200px;
	height: 300px;
	overflow: hidden;
	pointer-events: none;
	border-radius: 4px;
}

.weather-expanded-inner {
	background: white;
	width: 100%;
	height: 100%;
	pointer-events: unset;
	border-radius: 4px;
}

.slide-enter-active, .slide-leave-active {
	transition: transform .5s ease;
}

.slide-enter, .slide-leave-to {
	transform: translateY(-100%);
}
</style>
