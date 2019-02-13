<template>
	<transition
		name="fade-overlay" 
		:duration="{
			enter: enterDuration,
			leave: leaveDuration
	}">
		<div class="settings-overlay">
			<div class="lightbox" @click="closeSettings"></div>
			<div class="settings">
				<div class="content">
					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus quia, quaerat consequatur, facere perferendis nisi, architecto esse cumque pariatur enim eligendi voluptate eaque suscipit ullam? Aut a magni vero repellendus.</p>
					<p>Deleniti quae impedit ullam quis nulla incidunt laudantium distinctio, necessitatibus animi sequi praesentium aperiam. Praesentium ab iure ducimus hic. Nemo, cum assumenda deleniti magnam error nihil nobis praesentium ipsa cumque?</p>
					<p>Reiciendis animi alias rem, asperiores ipsam sit consectetur, quos maiores quod aut doloremque ut laborum aliquam nam neque libero voluptatem. Repellat quidem, ex aperiam possimus culpa voluptatibus praesentium cumque. Quae.</p>
					<p>Voluptatem molestiae recusandae tempore perferendis, sint maxime ipsa vel nulla dolore quam incidunt aut sunt tempora numquam labore hic illo sit, aperiam voluptatibus ut in. Quam, numquam reprehenderit? Voluptatem, reiciendis!</p>
					<p>Cumque explicabo veritatis voluptates fugit debitis? Possimus porro odio id commodi incidunt fugit, vel pariatur? Debitis vitae amet asperiores facere. Corporis sint adipisci possimus dolores, non voluptate consequuntur eum natus!</p>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	data() {
		return {
			enterDuration: 450,
			leaveDuration: 250
		}
	},
	methods: {
		closeSettings() {
			this.$store.commit('setShowSettingsOverlay', false);
		}
	}
}
</script>

<style scoped>
.settings-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
}

.lightbox {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
}

.settings {
	border-radius: 3px;
	position: relative;
	background: #f7f7f7;
	color: #333;

	padding: 1rem;
	
	min-width: 50rem;
	width: 60vw;
	max-width: 65rem;

	min-height: 25rem;
	height: 52vh;
}

/* TRANSITION */

.fade-overlay-leave-to > *, .fade-overlay-enter > *, .fade-overlay-leave-to .content, .fade-overlay-enter .content {
	opacity: 0;
}

.fade-overlay-enter > .settings, .fade-overlay-leave-to > .settings {
	transform: scale(1.1);
}

/* ENTER */

.fade-overlay-enter-active > .lightbox {
	transition: 0.35s ease;
}

.fade-overlay-enter-active > .settings {
	transition: opacity 0.3s ease 0.15s, transform 0.35s ease-in-out;
}

.fade-overlay-leave-active .content {
	transition: opacity 0.15s ease .15s;
}

/* LEAVE */

.fade-overlay-leave-active > .lightbox {
	transition: 0.2s ease-out 0.05s;
	transition-property: opacity;
}

.fade-overlay-leave-active > .settings {
	transition: 0.25s ease-out;
	transition-property: opacity, transform;
}

.fade-overlay-leave-active .content {
	transition: opacity 0.15s ease-out;
}
</style>
