const clampNum = (min, num, max) => Math.min(Math.max(num, min), max);

export default function resizable({
	isResizable = true
}) {
	return {
		data() {
			return {
				resizeDelta: {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				},
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
			resizeResult() {
				return {
					x: this.initialGridPos.x + this.resizeDelta.x,
					y: this.initialGridPos.y + this.resizeDelta.y,
					width: this.initialGridPos.width + this.resizeDelta.width,
					height: this.initialGridPos.height + this.resizeDelta.height,
				}
			}
		},
		methods: {
			onResizeStart(handle, e) {
				this.$_resizeOrigin = {
					x: e.clientX,
					y: e.clientY
				}
				this.$_resizeHandle = handle;
				this.resizing = true;

				console.log('on resize start from origin:', this.$_resizeOrigin);
				this.addResizeListeners();
			},
			onResizeUpdate(e) {
				const handle = this.$_resizeHandle;

				const mouseDeltaX = e.clientX - this.$_resizeOrigin.x;
				const mouseDeltaY = e.clientY - this.$_resizeOrigin.y;

				const gridDeltaX = Math.round(mouseDeltaX / this.cellSize.width);
				const gridDeltaY = Math.round(mouseDeltaY / this.cellSize.height);

				const curGridX = this.originalColStart;
				const curGridY = this.originalRowStart;
				const curGridWidth = this.initialGridPos.width;
				const curGridHeight = this.initialGridPos.height;

				const minGridDeltaX = -(curGridX);
				const maxGridDeltaX = this.$store.state.grid.cols - (curGridX + curGridWidth);

				const minGridDeltaY = -(curGridY);
				const maxGridDeltaY = this.$store.state.grid.rows - (curGridY + curGridHeight);

				const boundedGridDeltaX = clampNum(minGridDeltaX, gridDeltaX, maxGridDeltaX);
				const boundedGridDeltaY = clampNum(minGridDeltaY, gridDeltaY, maxGridDeltaY);

				let dx = 0;
				let dy = 0;
				let dWidth = 0;
				let dHeight = 0;


				if (handle.includes('left')) {
					dx = boundedGridDeltaX;
					dWidth = -boundedGridDeltaX;
				} else if (handle.includes('right')) {
					dWidth = boundedGridDeltaX;
				}
				if (handle.includes('top')) {
					dy = boundedGridDeltaY;
					dHeight = -boundedGridDeltaY;
				} else if (handle.includes('bottom')) {
					dHeight = boundedGridDeltaY;
				}

				this.resizeDelta = {
					x: dx,
					y: dy,
					width: dWidth,
					height: dHeight
				}
			},
			onResizeEnd(e) {
				console.log("Resize end");
				this.onResizeUpdate(e);
				this.removeResizeListeners();

				this.$_resizeHandle = null;
				this.resizing = false;
				this.resizeDelta = {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				}
				this.getWidgetSize();
			},
			addResizeListeners() {
				window.addEventListener('mousemove', this.onResizeUpdate);
				window.addEventListener('mouseup', this.onResizeEnd);
			},
			removeResizeListeners() {
				window.removeEventListener('mousemove', this.onResizeUpdate);
				window.removeEventListener('mouseup', this.onResizeEnd);
			},
		},
		watch: {
			resizeResult(newValue, oldValue) {
				let changed = false;
				if (!newValue || !Number.isInteger(newValue.x) || !this.resizing) {
					return;
				}

				for (const key in newValue) {
					if (!Number.isInteger(newValue[key])) {
						return;
					}
					if (newValue[key] !== oldValue[key] && newValue[key]) {
						changed = true;
					}
				}
				if (changed) {
					console.log({ ...newValue });
					this.updateWidgetGridSize({ ...newValue });
				}
			}
		}
	}
}