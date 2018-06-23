<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		class="icon"
		:style="sizeStyle"
	>	
		<g
			v-if="icon === 'refresh'"
		>
			<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
			<path d="M0 0h24v24H0z" fill="none"/>
		</g>
		<g
			v-else-if="icon === 'close'"
		>
			<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
			<path d="M0 0h24v24H0z" fill="none"/>
		</g>
		<g
			v-else-if="icon === 'download'"
		>
			<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
			<path fill="none" d="M0 0h24v24H0z"/>
		</g>	
		<g
			v-else-if="icon === 'cog'"
			transform="translate(2, 2)"
		>
			<path fill="none" d="M0 0h20v20H0V0z"/>
    		<path d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
		</g>
		<g
			v-else-if="icon === 'align-left'"
		>
			<path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/>
			<path d="M0 0h24v24H0z" fill="none"/>
		</g>
		<g
			v-else-if="icon === 'align-center'"
		>
			<path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/>
			<path d="M0 0h24v24H0z" fill="none"/>
		</g>
		<g
			v-else-if="icon === 'align-right'"
		>
			<path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/>
 			<path d="M0 0h24v24H0z" fill="none"/>
		</g>
	</svg>
</template>

<script>
export default {
	props: {
		icon: {
			type: String,
			required: true
		},
		size: {
			type: String,
			default: '18px'
		}
	},
	computed: {
		sizeStyle() {
			return {
				width: this.size,
				height: this.size
			}
		}
	}
}
</script>

<style scoped>
.icon {
	color: inherit;
	fill: currentColor;
}
</style>
