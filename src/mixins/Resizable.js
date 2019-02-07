export default function resizable({
	isResizable = true
}) {
	return {
		data() {
			return {
				resizeState: {},
				resizing: false
			}
		},
		created() {
			this.resizeHandles = [
				'top-left',
				'top',
				'top-right',
				'right',
				'bottom-right',
				'bottom',
				'bottom-left',
				'left'
			]
		},
		beforeDestroy() {
			this.removeResizeListeners();
		},
		computed: {

		},
		methods: {
			onResizeStart(handle, e) {
				this.$_resizeOrigin = {
					x: e.clientX,
					y: e.clientY
				}
				console.log('on resize start from origin:', this.$_resizeOrigin);
				this.resizing = true;
				this.addResizeListeners();
			},
			onResizeUpdate(e) {

			},
			onResizeEnd(e) {
				console.log("Resize end");
				this.onResizeUpdate(e);
				this.removeResizeListeners();
				this.resizing = false;
				// TODO: what is resize state?
				this.resizeState = {};
				this.getWidgetSize();
			},
			addResizeListeners() {
				window.addEventListener('mousemove', this.onResizeMove);
				window.addEventListener('mouseup', this.onResizeEnd);
			},
			removeResizeListeners() {
				window.removeEventListener('mousemove', this.onResizeMove);
				window.removeEventListener('mouseup', this.onResizeEnd);
			}
		},
		watch: {

		}
	}
}