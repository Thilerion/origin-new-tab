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
				const {x, y, width, height} = this.resizeDelta;
				if (!this.resizing) {
					return {x, y, width, height};
				}
				const res = {
					x: x + this.initialGridPos.x,
					y: y + this.initialGridPos.y,
					width: width + this.initialGridPos.width,
					height: height + this.initialGridPos.height
				}
				return res;
			}
		},
		methods: {
			onResizeStart(e, handle) {
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
				e.preventDefault();
				e.stopPropagation();
				const handle = this.$_resizeHandle;

				const mouseDeltaX = e.clientX - this.$_resizeOrigin.x;
				const mouseDeltaY = e.clientY - this.$_resizeOrigin.y;

				let dx = 0;
				let dy = 0;
				let dWidth = 0;
				let dHeight = 0;

				const curWidth = this.initialGridPos.width;
				const maxWidth = this.displayConf.maxWidth || this.$store.state.grid.cols;
				const minWidth = this.displayConf.minWidth || 1;

				const curX = this.initialGridPos.x;
				const maxX = curWidth - minWidth;
				const minX = Math.max((-curX), curWidth - maxWidth); 

				const curHeight = this.initialGridPos.height - 1;
				const maxHeight = this.displayConf.maxHeight || this.$store.state.grid.rows;
				const minHeight = this.displayConf.minHeight || 1;

				const curY = this.initialGridPos.y;
				const maxY = curHeight - minHeight;
				const minY = Math.max((-curY), curHeight - maxHeight);

				// console.log({curWidth, maxWidth, minWidth, curX, maxX, minX, curHeight, maxHeight, minHeight, curY, maxY, minY});

				const gridDeltaX = Math.round(mouseDeltaX / this.cellSize.width);
				const gridDeltaY = Math.round(mouseDeltaY / this.cellSize.height);

				if (handle.includes('left')) {
					const clampedX = clampNum(minX, gridDeltaX, maxX);
					dx = clampedX;
					dWidth = -clampedX;
				} else if (handle.includes('right')) {
					// TODO: use widget max width here as well
					const clampedX = clampNum(minWidth - curWidth, gridDeltaX, maxWidth - curWidth);
					dWidth = clampedX;
				}
				if (handle.includes('top')) {
					const clampedY = clampNum(minY, gridDeltaY, maxY);
					dy = clampedY;
					dHeight = -clampedY;
				} else if (handle.includes('bottom')) {
					const clampedY = clampNum(minHeight - curHeight, gridDeltaY, maxHeight - curHeight);
					dHeight = clampedY;
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
				this.resizeDelta = {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				}
				this.getWidgetSize();

				// to prevent click/select widget event from firing
				setTimeout(() => {
					this.resizing = false;
				}, 0);
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
					// console.log({ ...newValue });
					this.updateWidgetGridSize({ ...newValue });
				}
			}
		}
	}
}