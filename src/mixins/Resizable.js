import _isEqual from 'lodash.isequal';

export default {
	data() {
		return {
			activeHandle: null,
			initialPlaceOnGrid: {
				...this.getWidgetPlaceOnGrid()
			},
			lastGridDelta: {
				x: null,
				y: null
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
			const isInitialResizeState = (!dxGrid && !dyGrid && _isEqual(this.initialPlaceOnGrid, this.getWidgetPlaceOnGrid()));

			if (isInitialResizeState || (dxGrid === this.lastGridDelta.x && dyGrid === this.lastGridDelta.y)) {
				return;
			} else {
				this.lastGridDelta = { x: dxGrid, y: dyGrid };
			}
			
			const dEdges = this.getEdgeDelta(dxGrid, dyGrid);
			const initPos = this.initialPlaceOnGrid;
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

			const dWidth = validatedEdges.right - validatedEdges.left;
			const dHeight = validatedEdges.bottom - validatedEdges.top;
			
			const newPos = {
				x: initPos.x + validatedEdges.left,
				y: initPos.y + validatedEdges.top,
				width: initPos.width + dWidth,
				height: initPos.height + dHeight
			};

			if (newPos.x === this.widget.x &&
				newPos.y === this.widget.y &&
				newPos.width === this.widget.width &&
				newPos.height === this.widget.height) {
				console.log("Values are the same");
				return;

			} else {
				this.updateWidgetSize(newPos);
			}
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
			
			this.$nextTick(() => {
				this.activeHandle = null;
			})
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