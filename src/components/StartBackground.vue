<template>
<div class="background-image" :style="[backgroundStyle, blurStyle]">

</div>
</template>

<script>
export default {
	props: {
		source: {
			type: String
		}
	},
	computed: {
		backgroundStyle() {
			return {
				'background-image': `url(${this.backgroundUrl})`
			}
		},
		backgroundUrl() {
			return this.source || this.$store.getters.defaultBackground;
		},
		blur() {
			return this.$store.getters.isBlurred;
		},
		blurStyle() {
			if (this.blur) {
				return {
					'filter': 'contrast(0.9) brightness(0.9) blur(20px)',
					'transform': 'scale(1.1)'
				}
			} else {
				return {
					'filter': 'contrast(0.9) brightness(0.9)'
				}
			}		
		}
	}
}
</script>

<style scoped>
.background-image {
	position: fixed;
	top: 0; bottom: 0;
	left: 0; right: 0;
	background-size: cover;
	background-position: center;
	background-size: no-repeat;
	transform: scale(1.03);
}
</style>
