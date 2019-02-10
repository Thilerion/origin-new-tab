export default {
	data() {
		return {
			activeHandle: null,
			initialPlaceOnGrid: {
				...this.getWidgetPlaceOnGrid()
			}
		}
	},
	computed: {

	},
	methods: {
		onResizeStart(e, handle) {
			this.activeHandle = handle;

			this.initialPlaceOnGrid = this.getWidgetPlaceOnGrid();

			this.$_resizeOrigin = {
				x: e.clientX,
				y: e.clientY
			};
			console.log("Started resizing.");

			this.createResizeListeners();
		},
		onResizeUpdate(e) {
			if (!this.editing) {
				this.removeResizeListeners();
				return;
			}

			const dxMouse = e.clientX - this.$_resizeOrigin.x;
			const dyMouse = e.clientY - this.$_resizeOrigin.y;

			// Snap resize amounts to grid
			const dxGrid = this.convertHorPxToGrid(dxMouse);
			const dyGrid = this.convertVerPxToGrid(dyMouse);

			// If no resize is found, don't bother calculating the rest
			// TODO: only if not continuosly updating, else resizing back to original size is impossible
			if (!dxGrid && !dyGrid) {
				console.log("No change in resize dx and dy.");
				// return;
			}

			const dEdges = this.getEdgeDelta(dxGrid, dyGrid);

			const initPos = this.initialPlaceOnGrid;

			const colStart = 1;
			const colEnd = this.$store.state.grid.cols + 1;

			const rowStart = 1;
			const rowEnd = this.$store.state.grid.rows + 1;

			const maxDWidth = this.maxWidth - initPos.width;
			const minDWidth = this.minWidth - initPos.width;

			const validatedEdges = {};

			validatedEdges.left = this.validateLeftEdge(
				dEdges.left,
				initPos.left,
				this.maxWidth,
				this.minWidth,
				initPos.width
			);
			validatedEdges.right = this.validateRightEdge(
				dEdges.right,
				initPos.right,
				this.maxWidth,
				this.minWidth,
				initPos.width
			);
			validatedEdges.top = this.validateTopEdge(
				dEdges.top,
				initPos.top,
				this.maxHeight,
				this.minHeight,
				initPos.height
			);
			validatedEdges.bottom = this.validateBottomEdge(
				dEdges.bottom,
				initPos.bottom,
				this.maxHeight,
				this.minHeight,
				initPos.height
			);
			
			const newPos = {
				x: initPos.x + validatedEdges.left,
				y: initPos.y + validatedEdges.top,
				width: initPos.width + (validatedEdges.right - validatedEdges.left),
				height: initPos.height + (validatedEdges.bottom - validatedEdges.top)
			};

			this.updateWidgetSize(newPos);
		},

		validateLeftEdge(dLeft, origLeft, maxWidth, minWidth, origWidth) {
			if (dLeft === 0 || !this.activeHandle.includes('left')) return 0;

			const distLeftEdge = origLeft - this.colStart;
			const maxWidthInc = maxWidth - origWidth;
			const maxWidthDec = origWidth - minWidth;

			if (dLeft < 0) {
				return Math.max(-distLeftEdge, -maxWidthInc, dLeft);
			} else if (dLeft > 0) {
				return Math.min(maxWidthDec, dLeft);
			}
		},
		validateRightEdge(dRight, origRight, maxWidth, minWidth, origWidth) {
			if (dRight === 0 || !this.activeHandle.includes('right')) return 0;

			const distRightEdge = this.colEnd - origRight;
			const maxWidthInc = maxWidth - origWidth;
			const maxWidthDec = origWidth - minWidth;

			if (dRight < 0) {
				return Math.max(-maxWidthDec, dRight);
			} else if (dRight > 0) {
				return Math.min(maxWidthInc, distRightEdge, dRight);
			}
		},

		validateTopEdge(dTop, origTop, maxHeight, minHeight, origHeight) {
			if (dTop === 0 || !this.activeHandle.includes('top')) return 0;

			const distTopEdge = origTop - this.rowStart;
			const maxHeightInc = maxHeight - origHeight;
			const maxHeightDec = origHeight - minHeight;

			if (dTop < 0) {
				return Math.max(-distTopEdge, -maxHeightInc, dTop);
			} else if (dTop > 0) {
				return Math.min(maxHeightDec, dTop);
			}
		},
		validateBottomEdge(dBottom, origBottom, maxHeight, minHeight, origHeight) {
			if (dBottom === 0 || !this.activeHandle.includes('bottom')) return 0;

			const distBottomEdge = this.rowEnd - origBottom;
			const maxHeightInc = maxHeight - origHeight;
			const maxHeightDec = origHeight - minHeight;

			if (dBottom < 0) {
				return Math.max(-maxHeightDec, dBottom);
			} else if (dBottom > 0) {
				return Math.min(maxHeightInc, distBottomEdge, dBottom);
			}
		},

		onResizeEnd(e) {
			this.onResizeUpdate(e);
			this.removeResizeListeners();
			console.log("Stopped resizing.");
		},

		getEdgeDelta(dxGrid, dyGrid) {
			const h = this.activeHandle;

			const dEdges = {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				width: 0,
				height: 0
			}

			if (h.includes('left')) {
				dEdges.left = dxGrid;
			} else if (h.includes('right')) {
				dEdges.right = dxGrid;
			}
			if (h.includes('top')) {
				dEdges.top = dyGrid;
			} else if (h.includes('bottom')) {
				dEdges.bottom = dyGrid;
			}

			dEdges.width = dEdges.right - dEdges.left;
			dEdges.height = dEdges.bottom - dEdges.top;

			return dEdges;
		},
		
		createResizeListeners() {
			window.addEventListener('mousemove', this.onResizeUpdate);
			window.addEventListener('mouseup', this.onResizeEnd);
		},
		removeResizeListeners() {
			window.removeEventListener('mousemove', this.onResizeUpdate);
			window.removeEventListener('mouseup', this.onResizeEnd);
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
	}
}

function resizable({
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
					y: e.clientY,
					cellWidth: this.cellSize.width,
					cellHeight: this.cellSize.height
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

				const curHeight = this.initialGridPos.height;
				const maxHeight = this.displayConf.maxHeight || this.$store.state.grid.rows;
				const minHeight = this.displayConf.minHeight || 1;

				const curY = this.initialGridPos.y;
				const maxY = curHeight - minHeight;
				const minY = Math.max((-curY), curHeight - maxHeight);

				// console.log({curWidth, maxWidth, minWidth, curX, maxX, minX, curHeight, maxHeight, minHeight, curY, maxY, minY});

				const gridDeltaX = Math.round(mouseDeltaX / this.$_resizeOrigin.cellWidth);
				const gridDeltaY = Math.round(mouseDeltaY / this.$_resizeOrigin.cellHeight);

				if (handle.includes('left')) {
					const clampedX = clampNum(minX, gridDeltaX, maxX);
					console.log({ resWidth: curWidth - clampedX });
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